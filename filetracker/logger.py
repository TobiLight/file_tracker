import logging
from django.conf import settings


def config_logging(service, _logger, logging_level):
    # set the logging level that will be passed to the handler
    _logger.setLevel(logging_level)
    # Using a file for logging - file handler
    handler = logging.FileHandler(settings.BASE_DIR / 'filetracker.log')
    # set level for the handler, that the handler will send on.
    handler.setLevel(logging_level)
    # format logging message
    formatter = logging.Formatter('%(asctime)s - {} - %(levelname)s - %(message)s'.format(service))
    # add formatter to handler
    handler.setFormatter(formatter)
    # add handler to logger object
    _logger.addHandler(handler)
    return _logger
