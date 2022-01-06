import json
from django.http import HttpResponse
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from djstripe import webhooks
from djstripe.models import Customer, Product
from users.models import Profile
from plans.models import Plan
from django.contrib.auth import get_user_model
import re
from filetracker.logger import config_logging
import logging
from django.conf import settings
import os


# create logger object
logger_obj = logging.getLogger(__name__)

# configure logger object
logger = config_logging("upload file event: ", logger_obj, logging.INFO)

email_pattern = re.compile(r"P.*e")

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

User = get_user_model()


# immediately a user subscribes to a plan, a user's folder should be created for file uploads.
def create_upload_directory(_user):
    """
        Create an upload folder directory.
        :param _user: user instance.
    """
    user_email = _user.email
    # create the user directory for file upload.
    try:
        os.mkdir(os.path.join(settings.MEDIA_ROOT, str(user_email)))
    except OSError:
        logger.info("user directory already exists")


# Using Django - event handler
# Since the request is coming from stripe, there will be no csrf token. Hence, using the csrf_exempt decorator.
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    event = None

    try:
        event = stripe.Event.construct_from(
            json.loads(payload), settings.STRIPE_TEST_SECRET_KEY
        )
    except ValueError as e:
        # Invalid payload
        return HttpResponse(status=400)

    # Handle the event
    if event.type == 'customer.created':
        # successful creation of a customer.
        customer_created = event.data.object
        # print(customer_created)
    elif event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object  # contains a stripe.PaymentIntent
        # Then define and call a method to handle the successful payment intent.
        # handle_payment_intent_succeeded(payment_intent)
        # print(payment_intent)
    elif event.type == 'payment_method.attached':
        payment_method = event.data.object  # contains a stripe.PaymentMethod
        # Then define and call a method to handle the successful attachment of a PaymentMethod.
        # handle_payment_method_attached(payment_method)
        # print(payment_method)
    elif event.type == 'customer.subscription.created':
        subscription = event.data.object
        if subscription:
            # Note items is down as a stripe list object i.e "object": "list"
            # The data key is mapped to a list i.e it has a value which is a python list data type.
            plan = subscription["items"]["data"][0]["plan"]
            product_id = plan["product"]
            plan_name = Product.objects.get(id=product_id).name
            # Get the stripe customer id
            customer = Customer.objects.get(id=subscription["customer"])
            # The user profile model (users.models.Profile) needs to be updated to reflect the new plans the user has
            # just subscribed to.
            # Get the user object
            user = User.objects.get(email=customer.email)
            # Get the plan selected to update the user profile plan
            plan_selected = Plan.objects.get(plan_name=plan_name)
            # Get the user profile
            profile = Profile.objects.get(user=user)
            # Update the user profile
            profile.has_plan = True
            profile.plan = plan_selected
            # Update that specific profile in the user profile table
            profile.save(update_fields=["has_plan", "plan"])
            # create directory for user's file upload.
            create_upload_directory(user)
    elif event.type == 'setup_intent.created':
        setup_intent = event.data.object
        # print(setup_intent)
    # elif event.type == 'payment_method.created':
    #     payment_method_created = event.data.object
    #     print([payment_method_created])
    elif event.type == 'customer.deleted':
        customer_deleted = event.data.object
        print("Customer" + customer_deleted.id + "has been deleted")
        # On successful deletion of a customer, stripe event gets fired and we get the event trigger.
        Customer.objects.get(id=customer_deleted.id).delete()
    elif event.type == 'customer.updated':
        customer_updated = event.data.object
        print("Customer" + customer_updated.id + "has been updated")
    elif event.type == 'payment_intent.created':
        payment_intent_created = event.data.object
        # print(payment_intent_created)
    elif event.type == 'customer.subscription.deleted':
        customer_subscription_deleted = event.data.object
        print("Customer subscription" + customer_subscription_deleted.id + "has been deleted")
    else:
        print('Unhandled event type {}'.format(event.type))

    return HttpResponse(status=200)
