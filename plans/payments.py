import stripe
from django.conf import settings
from djstripe.models import PaymentMethod

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY


def card_create_payment_method(card_number, exp_month, exp_year, cvc, line1, city, country, name=None, email=None):
    """
        Payment Instrument.
        creates a card PaymentMethod object from the parameters that are passed into the method.
        :param str card_number: The card number
        :param int exp_month: The card expiry month
        :param int exp_year: The card expiry year
        :param str cvc: The last three digits at the back of the card
        :param str line1: billing address line
        :param str city: billing details city
        :param str country: billing details country
        :param str name: name on card
        :param str email: email address for billing purposes
    """

    # Returns the complete payment method object that could be json serialised.
    stripe_payment_method = stripe.PaymentMethod.create(
        type="card",
        card={
            "number": card_number,
            "exp_month": int(exp_month),
            "exp_year": int(exp_year),
            "cvc": cvc,
        },
        billing_details={
            "address": {
                "line1": line1,
                "city": city,
                "country": country,
            },
            "email": email,
            "name": name,
        }
    )

    # Sync the Stripe API return data to the database
    # Only return the payment method id object <id=pm_xxxxxxxxxxx>, that could not be json serialised.
    payment_method = PaymentMethod.sync_from_stripe_data(
      stripe_payment_method
    )

    if payment_method:
        return stripe_payment_method
