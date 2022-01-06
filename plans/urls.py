from django.urls import path
from plans.views import (
    PlanDetailAPIView,
    PlanListAPIView,
    PlanProfilesAPIView,
    CreateStripeCustomerAPIView,
    UpdateStripeCustomerPaymentDetailsAPIView,
    CustomerSubscriptionAPIView,
    CustomerDetailAPIView,
)
from plans.stripe_api_webhook import stripe_webhook


app_name = "plans"

urlpatterns = [
    path("user/<path:email>/", PlanDetailAPIView.as_view(), name="profile_plan"),
    path("list/", PlanListAPIView.as_view(), name="plan_list"),
    path("profiles/", PlanProfilesAPIView.as_view(), name="plan_profiles"),
    path("stripe/webhooks/", stripe_webhook, name="stripe_webhook"),
    path("stripe/create/customer/", CreateStripeCustomerAPIView.as_view(), name="create_customer"),
    path("stripe/update/payment-details/", UpdateStripeCustomerPaymentDetailsAPIView.as_view(), name="update_payment_details"),
    path("stripe/subscribe/", CustomerSubscriptionAPIView.as_view(), name="subscribe_customer"),
    path("stripe/customer/<path:email>/", CustomerDetailAPIView.as_view(), name="retrieve_customer")
]
