from django.core.exceptions import ValidationError
from django.db import models
import os
from django.conf import settings
from users.models import Profile
from django.contrib.auth import get_user_model
from filetracker.logger import config_logging
import logging

# create logger object
logger_obj = logging.getLogger(__name__)

User = get_user_model()


# absolute path of the user home directory.
def user_abspath_directory(user):
    # user root directory will be MEDIA_ROOT/<user_email>
    return os.path.join(settings.MEDIA_ROOT, f"{user.email}")


# user email field validator for the Folder model.
def user_email_validator(email):
    # configure logger object
    logger = config_logging("Folder creation event: ", logger_obj, logging.INFO)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = None
    if not user:
        logger.error("User does not exist.")
        raise ValidationError("User does not exist.")


# convert the path_to_folder or path_to_file field to a path starting from the user home directory.
def convert_path(_path_to_folder):
    path_list = _path_to_folder.split('/')
    if path_list[0] == "user_home":
        if len(path_list) == 1:
            return ""
        else:
            return "/".join(path_list[1:])
    return None


# file upload path from or relative to static/media/ for the upload_to field.
def file_upload_path(instance, filename):
    owner_email = instance.folder.owner_email
    path_to_file = convert_path(instance.path_to_file)
    return os.path.join(owner_email, path_to_file, instance.filename)


# Create your models here.
class Folder(models.Model):
    folder_name = models.CharField(max_length=150, null=False, blank=False)
    path_to_folder = models.CharField(max_length=255, null=False, blank=False)  # from the user's home directory.
    date_created = models.DateTimeField(auto_now_add=True, auto_now=False)
    date_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    owner_email = models.EmailField(max_length=150, validators=[user_email_validator])
    profiles_with_access_rights = models.ManyToManyField(Profile, related_name="folders", blank=False)

    @property
    def folder_absolute_path(self):
        user = User.objects.get(email=self.owner_email)
        if user:
            # instance of the model i.e. an entry into the database model will not be created except the path_to_folder
            # field is provide. Hence, no need to check for the emptiness of this field.
            value = convert_path(str(self.path_to_folder))
            if value is not None:
                return os.path.join(str(user_abspath_directory(user)), value, str(self.folder_name))


class FileUpload(models.Model):
    filename = models.CharField(max_length=255, null=False, blank=False)
    path_to_file = models.CharField(max_length=255, null=False, blank=False)  # from the user's home directory.
    file = models.FileField(upload_to=file_upload_path)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="files", null=True, blank=True)
    date_uploaded = models.DateTimeField(auto_now_add=True, auto_now=False)
    date_modified = models.DateTimeField(auto_now_add=False, auto_now=True)

    @property
    def file_absolute_path(self):
        owner_email = self.folder.owner_email
        print(owner_email)
        user = User.objects.get(email=owner_email)
        if user:
            file_path = convert_path(str(self.path_to_file))
            if file_path is not None:
                return os.path.join(str(user_abspath_directory(user)), file_path, str(self.filename))
