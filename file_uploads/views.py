from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ParseError, ValidationError
from django.conf import settings
from utils import CustomValidation, convert_path_raise_validation_error
import os
from rest_framework import authentication, permissions
from filetracker.logger import config_logging
import logging
from file_uploads.serializers import FolderSerializer, FileUploadSerializer
from file_uploads.models import Folder, convert_path, user_abspath_directory, \
    user_email_validator, User, FileUpload
from django.db.models import Q
from filetracker.sql_statement import SQL
from rest_framework.response import Response
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404
import shutil
from rest_framework import renderers
from django.http import HttpResponse
from django.core.exceptions import MultipleObjectsReturned

# create logger object
logger_obj = logging.getLogger(__name__)


# Create folder.
def create_folder(path, folder_name, user):
    # configure logger object
    logger = config_logging("create folder event: ", logger_obj, logging.INFO)
    # Absolute path of the folder to be created.
    folder = os.path.join(user_abspath_directory(user), path, folder_name)
    # CTA button to create a folder will always be in the parent folder/directory. Hence, must not use os.makedirs()
    # to create any missing parent directory.
    try:
        os.mkdir(folder)
    except OSError as error:
        logger.error(error)
        raise CustomValidation('The parent directory does not exist (invalid parent path)', path,
                               status_code=status.HTTP_404_NOT_FOUND)


# get the path to the folder and folder that the file will be uploaded to.
def folder_and_path(path_to_file):
    # take out the trailing slash /, if there is one.
    if str(path_to_file)[-1] in ["/", "\\"]:
        path_to_file = str(path_to_file)[:-1]
    else:
        path_to_file = str(path_to_file)
    path_to_folder, folder = os.path.split(path_to_file)
    return path_to_folder, folder


# current folder where file is to be uploaded to.
def current_upload_folder(user_email, path_to_folder, folder):
    return os.path.join(settings.MEDIA_ROOT, user_email, path_to_folder, folder)


# delete file given the absolute path of the file.
def delete_file(abs_file_path):
    logger = config_logging("delete file event: ", logger_obj, logging.INFO)
    if os.path.exists(abs_file_path):
        os.remove(abs_file_path)
    else:
        logger.error("The file to be deleted does not exists on the file system.")
        raise CustomValidation('The file does not exists on the file system.', os.path.basename(abs_file_path),
                               status_code=status.HTTP_404_NOT_FOUND)


# delete the folder whose absolute path is given. This will delete the folder and its content if it is not empty.
def delete_folder(abs_folder_path):
    logger = config_logging("delete folder event: ", logger_obj, logging.INFO)
    if os.path.exists(abs_folder_path):
        if os.path.isdir(abs_folder_path):
            # Note: For non-empty folder make sure the front end prompts the user to confirm deletion before the folder
            # is deleted.
            shutil.rmtree(abs_folder_path)
        else:
            logger.error("The path provided for the folder to be deleted is not an existing directory.")
            raise CustomValidation('The path provided is not an existing directory.', os.path.basename(abs_folder_path),
                                   status_code=status.HTTP_400_BAD_REQUEST)
    else:
        logger.error("The path of the folder specified does not exists on the file system.")
        raise CustomValidation('The folder path specified does not exists on the file system.',
                               os.path.basename(abs_folder_path),
                               status_code=status.HTTP_404_NOT_FOUND)


# Create your views here.
# create user folder.
class FolderCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FolderSerializer
    queryset = Folder.objects.all()

    def get_serializer(self, *args, **kwargs):
        # leave this intact
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()

        """
        Intercept the request and see if it needs to be modified.
        """
        if (folder_name := self.request.data.get("folder_name")) and (
                path_to_folder := self.request.data.get("path_to_folder")) and (
                owner_email := self.request.data.get("owner_email")
        ):
            # get the user's profile
            profile = self.request.user.profile
            if profile:
                # Copy and manipulate the request
                draft_request_data = self.request.data.copy()
                draft_request_data["folder_name"] = folder_name
                draft_request_data["path_to_folder"] = path_to_folder
                draft_request_data["owner_email"] = owner_email
                draft_request_data["profiles_with_access_rights"] = [profile.id]
                kwargs["data"] = draft_request_data
                return serializer_class(*args, **kwargs)
        """
        If not, proceed.
        """
        return serializer_class(*args, **kwargs)

    # This method is called within the create method once the serialization is valid.
    # Should probably use the create method.
    def perform_create(self, serializer):
        # configure logger object
        logger = config_logging("create folder event: ", logger_obj, logging.INFO)
        data = self.request.data
        folder_name = data.get("folder_name", None)
        owner_email = data.get("owner_email", None)
        raw_path_to_folder = data.get("path_to_folder", None)
        if not folder_name:
            raise ValidationError("You need to provide a folder name")
        if not owner_email:
            raise ValidationError("You need to provide the email address for the folder owner.")
        if not raw_path_to_folder:
            raise ValidationError("You need to specify a path where the folder will be mounted.")
        # Check if the user making the request is the same as the email address supplied.
        # User should only be able to create a folder in their own directory.
        if not self.request.user.email == owner_email:
            raise CustomValidation('User making the request is different from the email supplied.', owner_email,
                                   status_code=status.HTTP_406_NOT_ACCEPTABLE)

        # Before the user email validation in the Folder database model.
        # validate the user email before creating the folder.
        user_email_validator(owner_email)
        # After successfully validating the user email.
        user = User.objects.get(email=owner_email)

        # convert the path_to_folder field to a path starting from the user home directory.
        _convert_path = convert_path_raise_validation_error(convert_path)
        path_to_folder = _convert_path(raw_path_to_folder)

        # verify path to folder and raise custom validation error if the path_to_folder field is invalid.
        try:
            # check if folder or directory already exists.
            folder = Folder.objects.get(Q(folder_name=folder_name) & Q(path_to_folder=raw_path_to_folder))
            if folder.folder_absolute_path == os.path.join(user_abspath_directory(user), path_to_folder, folder_name):
                logger.info("The folder already exists in the specified directory.")
                raise CustomValidation('The folder already exists in the specified directory.', folder_name,
                                       status_code=status.HTTP_409_CONFLICT)
        except Folder.DoesNotExist:
            pass
        except MultipleObjectsReturned:
            logger.info("The folder already exists in the specified directory.")
            raise CustomValidation('The folder already exists in the specified directory.', folder_name,
                                   status_code=status.HTTP_409_CONFLICT)
        logger.info("Creating the folder in the specified directory.")
        # Create folder in the user's directory.
        create_folder(path_to_folder, folder_name, user)
        serializer.save()


class FolderDeleteAPIView(generics.DestroyAPIView):
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Folder.objects.all()

    def get_queryset(self):
        """
        Get the list of items for this view.
        This must be an iterable, and may be a queryset.
        Defaults to using `self.queryset`.

        This method should always be used rather than accessing `self.queryset`
        directly, as `self.queryset` gets evaluated only once, and those results
        are cached for all subsequent requests.

        You may want to override this if you need to provide different
        querysets depending on the incoming request.

        (Eg. return a list of items that is specific to the user)
        """
        assert self.queryset is not None, (
                "'%s' should either include a `queryset` attribute, "
                "or override the `get_queryset()` method."
                % self.__class__.__name__
        )

        # get user email.
        user_email = self.request.user.email
        # make sure only the current user folders could be deleted.
        queryset = Folder.objects.filter(owner_email=user_email)
        if isinstance(queryset, QuerySet):
            if queryset:
                return queryset
        return None

    def get_object(self):
        """
                Returns the object the view is displaying.

                You may want to override this if you need to provide non-standard
                queryset lookups.  Eg if objects are referenced using multiple
                keyword arguments in the url conf.
                """
        queryset = self.filter_queryset(self.get_queryset())

        # The right way will be probably to use query parameters or have the parameters in the url path.
        if queryset:
            data = self.request.data
            # path to folder and folder both have no trailing slash /.
            path_to_folder = data.get("path_to_folder")
            folder_name = data.get("folder_name")
            if not path_to_folder:
                raise ValidationError("You need to provide the path_to_folder field.")
            if not folder_name:
                raise ValidationError("You need to provide the folder_name field.")

            # The absolute path of the folder to be deleted will be distinct as they could only be one specific
            # folder path.
            user_email = self.request.user.email
            path_to_folder_mod = convert_path(path_to_folder)
            folder_path = os.path.join(user_email, path_to_folder_mod, folder_name)
            abs_folder_path = os.path.join(settings.MEDIA_ROOT, folder_path)
            delete_folder(abs_folder_path)
            filter_kwargs = {"path_to_folder": path_to_folder, "folder_name": folder_name}
            obj = get_object_or_404(queryset, **filter_kwargs)
            # May raise a permission denied
            self.check_object_permissions(self.request, obj)
            return obj
        raise ValidationError("No folders found.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("The folder was successfully deleted.", status=status.HTTP_204_NO_CONTENT)


class FileUploadView(APIView):
    parser_classes = (MultiPartParser,)
    exclude_files = ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'flv', 'mov',
                     '3pg', 'aa', 'mp3', 'wav', 'm4a', 'mv']
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_email = request.user.email
        data = request.data.copy()
        file = request.FILES
        # logger object for logging.
        logger = config_logging("file upload view event: ", logger_obj, logging.INFO)
        try:
            actual_file_ext = os.path.splitext(file["file"].name)[-1]
            if actual_file_ext[1:] in self.exclude_files:
                return Response("Error: The file extension is not supported for upload.", status.HTTP_400_BAD_REQUEST)
            # get the folder associated with the file.
            path_to_file = data.get('path_to_file')
            if path_to_file:
                # path to the folder where the file will be uploaded to.
                path_to_folder, file_upload_folder = folder_and_path(path_to_file)
                # Fetch the folders and path_to_folders from the database.
                sql_query = SQL("sqlite3", "db.sqlite3")
                # Table name is combination of the app name and the model/table name.
                # For folder model, the field that distinguishes a specific user is the owner_email.
                # get the folder entry for a specific folder, path_to_folder and owner_email.
                table_name = "file_uploads_folder"
                upload_folder_data = sql_query.get_path_folder(table_name, file_upload_folder, path_to_folder,
                                                               user_email)
                if upload_folder_data:
                    # using assignment expression
                    if (filename := data.get('filename')) and file:
                        ext_provided = os.path.splitext(filename)[-1]
                        if not ext_provided:
                            filename = str(filename) + actual_file_ext
                        # check if the file name exists.
                        upload_folder = current_upload_folder(user_email, convert_path(path_to_folder),
                                                              file_upload_folder)
                        files_available = [_file for _file in os.listdir(upload_folder) if os.path.isfile(
                            os.path.join(upload_folder, _file)) is True]
                        if filename not in files_available:
                            data["folder"] = upload_folder_data["id"]
                            file_upload_serializer = FileUploadSerializer(data=data)
                            if file_upload_serializer.is_valid():
                                file_upload_serializer.save()
                            else:
                                return Response(f"Error: {file_upload_serializer.errors}", status.HTTP_400_BAD_REQUEST)
                            return Response(f"filename: {filename} has been uploaded", status.HTTP_200_OK)
                        return Response(f"Error: A file with that name already exists", status.HTTP_409_CONFLICT)
                    return Response("Error: Provide the filename or file to be uploaded.", status.HTTP_400_BAD_REQUEST)
                return Response("Error: The upload folder selected does not exist.", status.HTTP_404_NOT_FOUND)
            return Response("Error: field path_to_file is needed", status.HTTP_400_BAD_REQUEST)
        except KeyError as error:
            logger.error("No file has been selected for upload.")
            return Response("Error: No file has been selected for upload.", status.HTTP_400_BAD_REQUEST)


class FileDeleteAPIView(generics.DestroyAPIView):
    serializer_class = FileUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = FileUpload.objects.all()

    def get_queryset(self):
        """
        Get the list of items for this view.
        This must be an iterable, and may be a queryset.
        Defaults to using `self.queryset`.

        This method should always be used rather than accessing `self.queryset`
        directly, as `self.queryset` gets evaluated only once, and those results
        are cached for all subsequent requests.

        You may want to override this if you need to provide different
        querysets depending on the incoming request.

        (Eg. return a list of items that is specific to the user)
        """
        assert self.queryset is not None, (
                "'%s' should either include a `queryset` attribute, "
                "or override the `get_queryset()` method."
                % self.__class__.__name__
        )

        # get user email.
        user_email = self.request.user.email
        # make sure only the current user files could be deleted.
        queryset = FileUpload.objects.filter(file__startswith=user_email)
        if isinstance(queryset, QuerySet):
            if queryset:
                return queryset
        return None

    def get_object(self):
        """
                Returns the object the view is displaying.

                You may want to override this if you need to provide non-standard
                queryset lookups.  Eg if objects are referenced using multiple
                keyword arguments in the url conf.
                """
        queryset = self.filter_queryset(self.get_queryset())

        # The right way will be probably to use query parameters or have the parameters in the url path.
        if queryset:
            data = self.request.data
            # path to file has no trailing slash /.
            path_to_file = data.get("path_to_file")
            filename = data.get("filename")
            if not path_to_file:
                raise ValidationError("You need to provide the path_to_file field.")
            if not filename:
                raise ValidationError("You need to provide the filename field.")

            # The file path will be distinct as they could only be one specific file path.
            user_email = self.request.user.email
            path_to_file_mod = convert_path(path_to_file)
            file_path = os.path.join(user_email, path_to_file_mod, filename)
            abs_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
            delete_file(abs_file_path)
            filter_kwargs = {"path_to_file": path_to_file, "filename": filename}
            obj = get_object_or_404(queryset, **filter_kwargs)
            # May raise a permission denied
            self.check_object_permissions(self.request, obj)
            return obj
        raise ValidationError("No files found.")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("The file was successfully deleted.", status=status.HTTP_204_NO_CONTENT)


class PassThroughRenderer(renderers.BaseRenderer):
    """
        Return data as-is. View should supply a Response.
    """
    media_type = ''
    format = ''

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


# Download file API view class.
# No need for a serializer class or queryset field.
class FileDownloadAPIView(APIView):
    parser_classes = (PassThroughRenderer,)
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # logger object for logging.
        logger = config_logging("file download view event: ", logger_obj, logging.INFO)
        user_email = request.user.email
        path_to_file = request.query_params.get("path_to_file")
        filename = request.query_params.get("filename")
        # check if file exists.
        path_to_file_mod = convert_path(path_to_file)
        file_field = os.path.join(user_email, path_to_file_mod, filename)
        try:
            # for checking in the FileUpload model database use a forward slash.
            path_in_db = user_email + "/" + path_to_file_mod + "/" + filename
            file = FileUpload.objects.get(file=path_in_db)
            abs_file_path = os.path.join(settings.MEDIA_ROOT, file_field)
            if os.path.exists(abs_file_path) and os.path.isfile(abs_file_path):
                with open(abs_file_path, 'rb') as r_file:
                    response = HttpResponse(r_file.read(), content_type="application/octet-stream")
                    response["Content-Disposition"] = 'inline; filename=' + os.path.basename(abs_file_path)
                    return response
            else:
                logger.error("The file does not exists on the file system.")
                raise CustomValidation('The file does not exists on the file system.', os.path.basename(abs_file_path),
                                       status_code=status.HTTP_404_NOT_FOUND)
        except FileUpload.DoesNotExist:
            logger.error("The download file specified does not exists.")
            return Response("The download file specified does not exists.", status=status.HTTP_404_NOT_FOUND)


# Get all the files and folders in a specific directory.
class ListFileFolderAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_email = self.request.user.email
        # path to directory.
        path_to_dir = request.query_params.get("path_to_dir")
        path_to_dir_mod = convert_path(path_to_dir)
        # check the file system is the directory path exists.
        dir_path = os.path.join(settings.MEDIA_ROOT, user_email, path_to_dir_mod)
        if os.path.exists(dir_path) and os.path.isdir(dir_path):
            contents = os.listdir(dir_path)
            return Response(contents, status.HTTP_200_OK)
        else:
            raise CustomValidation('The directory does not exists on the file system.', os.path.basename(dir_path),
                                   status_code=status.HTTP_404_NOT_FOUND)
