def webhook_event_callback(event):
    """ Dispatches the event to celery for processing. """
    from . import tasks
    # Asynchronous hand-off to celery so that we can continue immediately
    tasks.process_webhook_event.s(event).apply_async()
