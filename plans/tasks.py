from stripe.error import StripeError
from celery import shared_task
import logging
from filetracker.logger import config_logging


# create logger object
logger_obj = logging.getLogger(__name__)

# app/service creating the log event
module_event = "stripe event: tasks.py"


@shared_task(bind=True)
def process_webhook_event(self, event):
    """ Processes events from Stripe asynchronously. """

    logger = config_logging(module_event, logger_obj, logging.INFO)
    logger.info("Processing Stripe event: %s", str(event))
    try:
        event.process(raise_exception=True)
    except StripeError as exc:
        logger = config_logging(module_event, logger_obj, logging.ERROR)
        logger.error("Failed to process Stripe event: %s", str(event))
        raise self.retry(exc=exc, countdown=60)  # retry after 60 seconds
