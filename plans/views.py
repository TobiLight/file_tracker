from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework import authentication, permissions
from plans.models import Plan
from plans.serializers import PlanSerializer, PlanWithoutProfilesSerializer
import urllib
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
import stripe
from users.models import Profile
import djstripe
from django.conf import settings
from djstripe.models import Customer, PaymentMethod, Product
import logging
from filetracker.logger import config_logging
from plans import payments
import json

User = get_user_model()

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

# create logger object
logger_obj = logging.getLogger(__name__)


# Create your views here.
# Only to be used by the administrator
class PlanCreateAPIView(generics.CreateAPIView):
    pass


# Get the list of plans available to users.
class PlanListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PlanWithoutProfilesSerializer
    queryset = Plan.objects.all()


# Get all plans including the associated user profiles.
class PlanProfilesAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PlanSerializer
    queryset = Plan.objects.all()


# Retrieve a user's current plan including the user's full profile.
class PlanDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PlanSerializer
    queryset = Plan.objects.all()
    lookup_field = "profile__user__email"
    lookup_url_kwarg = "email"


# Create a Stripe billing customer when a user wants to subscribe to a plan by calling the stripe customers endpoint.
def create_customer(email, name, card_number, exp_month, exp_year, cvc, line1, city, country):
    logger = config_logging("create customer event: ", logger_obj, logging.INFO)
    try:
        # Can not use the subscriber parameter as the customer does not yet have that attribute.
        customer = Customer.objects.get(email=email)
        # if customer with that email already exists, do nothing and let the end user know the customer already exist.
        if customer:
            logger.warning("customer already exist")
            return False, "customer already exist"
    except Customer.DoesNotExist:
        logger.info("creating customer...")
        # First create the customer's payment instrument.
        payment_method = payments.card_create_payment_method(card_number, exp_month, exp_year, cvc, line1, city,
                                                             country, name, email)
        # get the payment method id
        payment_method_id = json.loads(str(payment_method))["id"]
        # creating a new customer will be done by using the stripe python module and then it could be synchronised
        # with the djstripe models.
        # create customer using stripe API
        stripe_customer = stripe.Customer.create(
            email=email,
            name=name,
        )

        # Attached the payment method to the customer.
        payment_method_attached = stripe.PaymentMethod.attach(
            payment_method_id,
            customer=json.loads(str(stripe_customer))["id"],
        )

        # Set the customer's default card
        stripe.Customer.modify(
            stripe_customer.id,
            invoice_settings={"default_payment_method": payment_method_attached},
        )

        # Sync the Stripe API return data to the database,
        # this way we don't need to wait for a webhook-triggered sync
        # Note: Do not have to worry about serialization.
        customer = Customer.sync_from_stripe_data(
            stripe_customer
        )

        # Synchronise payment method with database.
        PaymentMethod.sync_from_stripe_data(
            payment_method_attached
        )

        if customer and payment_method_attached:
            # if the was customer created and synchronised with the djstripe database successfully
            return True, stripe_customer
    # else return False
    return False, None


# Create a stripe customer for subscribing to a plan.
# Ad-hoc API View just to get the post data from the frontend.
class CreateStripeCustomerAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Create a stripe customer for subscribing to a plan.
        """
        data = self.request.data
        if 9 <= len(data) <= 12:
            user_email = data.get("email")
            user_name = data.get("name")
            card_number = data.get("card_number")
            exp_month = data.get("exp_month")
            exp_year = data.get("exp_year")
            cvc = data.get("cvc")
            line1 = data.get("line1")
            line2 = data.get("line2")
            post_code = data.get("post_code")
            state = data.get("state")
            city = data.get("city")
            country = data.get("country")
            if user_email and user_name and card_number and exp_month and exp_year and cvc and line1 and city \
                    and country:
                successful, message = create_customer(user_email, user_name, card_number, exp_month, exp_year,
                                                      cvc, line1, city, country)
                if successful:
                    return Response(message, status=status.HTTP_201_CREATED)
                else:
                    if message == "customer already exist":
                        return Response("Customer with that email address already exists",
                                        status=status.HTTP_409_CONFLICT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


# Update the customer payment detail or instrument
def update_customer_payment_detail(email, name, card_number, exp_month, exp_year, cvc, line1, city, country):
    logger = config_logging("customer update payment detail event: ", logger_obj, logging.INFO)
    try:
        # Can not use the subscriber parameter as the customer does not yet have that attribute.
        customer = Customer.objects.get(email=email)
        # Make sure the customer exists.
        if customer:
            logger.info("updating customer payment instrument...")
            # First create the customer's payment instrument.
            payment_method = payments.card_create_payment_method(card_number, exp_month, exp_year, cvc, line1, city,
                                                                 country, name, email)
            # get the payment method id
            # payment_method_id = json.loads(str(payment_method))["id"]
            payment_method_id = payment_method.id

            # Attached the payment method to the customer.
            payment_method_attached = stripe.PaymentMethod.attach(
                payment_method_id,
                customer=customer.id,
            )

            # Retrieve the customer to synchronize
            stripe_customer = stripe.Customer.retrieve(customer.id)

            # Set the customer default payment method
            stripe.Customer.modify(
                stripe_customer.id,
                invoice_settings={"default_payment_method": payment_method_attached},
            )

            customer_sync = Customer.sync_from_stripe_data(
                stripe_customer
            )

            payment_method_sync = PaymentMethod.sync_from_stripe_data(
                payment_method_attached
            )

            if customer_sync and payment_method_sync:
                return True, payment_method_attached
    except Customer.DoesNotExist:
        logger.error("Customer does not exist")
        return False, "Customer does not exist"
    return False, None


# Update the customer payment details or instrument.
class UpdateStripeCustomerPaymentDetailsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Update a stripe customer payment details or instrument.
        """
        data = self.request.data
        if 7 <= len(data) <= 12:
            user_email = data.get("email")
            user_name = data.get("name")
            card_number = data.get("card_number")
            exp_month = data.get("exp_month")
            exp_year = data.get("exp_year")
            cvc = data.get("cvc")
            line1 = data.get("line1")
            line2 = data.get("line2")
            post_code = data.get("post_code")
            state = data.get("state")
            city = data.get("city")
            country = data.get("country")
            if card_number and exp_month and exp_year and cvc and line1 and city and country:
                if not user_email:
                    user_email = request.user.email
                if not user_name:
                    user_name = Customer.objects.get(email=user_email)

                updated, message = update_customer_payment_detail(user_email, user_name, card_number, exp_month,
                                                                  exp_year,
                                                                  cvc, line1, city, country)
                if updated:
                    return Response(message, status=status.HTTP_200_OK)
                else:
                    if message == "Customer does not exist":
                        return Response("Customer with that email address does not exists", status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_400_BAD_REQUEST)


# Create a subscription for a customer
class CustomerSubscriptionAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger = config_logging("customer subscription event: ", logger_obj, logging.INFO)
        user_email = self.request.user.email
        plan = request.data.get('plan')
        if plan:
            _, letter = plan.split(" ")
            if len(letter) == 1:
                plan_letter = letter.upper()
                try:
                    customer = Customer.objects.get(email=user_email)
                    if customer and plan_letter:
                        product = Product.objects.get(name="Plan" + " " + plan_letter)
                        plan_id = djstripe.models.Plan.objects.get(product=product).id
                        stripe_subscription = stripe.Subscription.create(
                            customer=customer.id,
                            items=[{"plan": plan_id}],
                            collection_method="charge_automatically",
                        )

                        # Sync the Stripe API return data to the database,
                        # this way we don't need to wait for a webhook-triggered sync
                        subscription = djstripe.models.Subscription.sync_from_stripe_data(
                            stripe_subscription
                        )

                        if subscription:
                            return Response(stripe_subscription, status=status.HTTP_201_CREATED)
                except Customer.DoesNotExist:
                    logger.error("Customer does not exist")
                except Product.DoesNotExist:
                    logger.error("Product does not exist")
                except djstripe.models.Plan.DoesNotExist:
                    logger.error("Plan does not exist")
        return Response(f"Stripe customer with email address {user_email} does not exists.",
                        status=status.HTTP_400_BAD_REQUEST)


# Get stripe customer's details
class CustomerDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, email, *args, **kwargs):
        logger = config_logging("customer subscription event: ", logger_obj, logging.INFO)
        user_email = self.request.user.email
        if user_email == email:
            try:
                customer_obj = Customer.objects.get(email=user_email)
                customer = stripe.Customer.retrieve(customer_obj.id)
                if customer:
                    return Response(customer, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                logger.error("Customer does not exist")
                return Response("Customer with that email address does not exists", status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_400_BAD_REQUEST)
