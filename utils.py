import functools
from django.utils.encoding import force_text
from rest_framework.exceptions import APIException
from rest_framework import status
import os
import dotenv

dotenv.load_dotenv('.env')

# create dictionary to hold connection info for connecting to the running instance of the mysql database using
# the python/mysql connector.
dbConfig = {
    'user': os.environ['user'],  # use your admin name
    'password': os.environ['password'],
    'host': '127.0.0.1'  # IP address of localhost
}


# Custom validation
class CustomValidation(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'A server error occurred.'

    def __init__(self, detail, field, status_code):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = {field: force_text(detail)}
        else:
            self.detail = {'detail': force_text(self.default_detail)}


# define a decorator function that takes in convert_path function and add extra functionality to it to raise a
# validation error.
def convert_path_raise_validation_error(original_function):
    @functools.wraps(original_function)
    def wrapper(*args, **kwargs):
        value = original_function(*args, **kwargs)
        if value is None:
            raise CustomValidation("This field has an invalid value", "path_to_folder", status.HTTP_400_BAD_REQUEST)
        return value
    return wrapper
