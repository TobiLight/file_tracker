from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework.reverse import reverse
from rest_framework.response import Response
from users.serializers import (
    UserCreateSerializer,
    UserLoginSerializer,
    ProfileSerializer,
    AdminUserCreateSerializer,
    UserSerializer,
    ChangePasswordSerializer,
)
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import authentication, permissions
from rest_framework import generics, status
from django.conf import settings
from rest_framework_jwt.settings import api_settings as jwt_settings
from django.contrib.auth import logout as django_logout
from users.models import Profile
from filetracker.logger import config_logging
import logging
from file_uploads.models import user_abspath_directory, Folder
import shutil
import stripe
from djstripe.models import Customer


# Create your views here.
User = get_user_model()

# create logger object
logger_obj = logging.getLogger(__name__)


# Delete user home directory when user is deleted by admin.
def delete_user_home_dir(user):
    # configure logger object
    logger = config_logging("delete user home directory event: ", logger_obj, logging.INFO)
    # Absolute path of the user home directory.
    user_home_directory = user_abspath_directory(user)
    try:
        shutil.rmtree(user_home_directory)
        return True
    except OSError as error:
        logger.error(error)
        return False


# User Login View
class UserLoginAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # Does not need the serializer_class, as it's just a base APIView.
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        token = request.META["HTTP_AUTHORIZATION"]
        self.request.user.token = token
        self.request.user.save(update_fields=["token"])
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            new_data = serializer.data
            return Response(new_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User logout View
class UserLogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        if getattr(settings, "ACCOUNT_LOGOUT_ON_GET", True):
            response = self.logout(request)
        else:
            response = self.http_method_not_allowed(request, *args, **kwargs)

        return self.finalize_response(request, response, *args, **kwargs)

    def logout(self, request):
        try:
            request.user.token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass
        if getattr(settings, "REST_SESSION_LOGIN", True):
            django_logout(request)
        response = Response(
            {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
        )
        if getattr(settings, "JWT_AUTH", False):
            if jwt_settings.JWT_AUTH_COOKIE:
                response.delete_cookie(jwt_settings.JWT_AUTH_COOKIE)
        return response


# Create user view
class UserCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserCreateSerializer
    queryset = User.objects.all()

    # This method is called within the create method once the serialization is valid.
    # Should probably use the create method.
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
    lookup_field = "email"
    lookup_url_kwarg = "email"


# Check if a user/profile has a plan associated with their account.
class CheckPlanAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    lookup_field = "user__email"
    lookup_url_kwarg = "email"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        has_plan = serializer.data["has_plan"]
        return Response(has_plan)


# Get the profile of a specific user.
class ProfileDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    lookup_field = "user__email"
    lookup_url_kwarg = "email"


# Create admin user account.
class AdminUserCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AdminUserCreateSerializer
    queryset = User.objects.all()

    # This method is called within the create method once the serialization is valid.
    # Should probably use the create method.
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# List user profile for admin user.
class ListUserProfileAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


# API view for admin to delete user.
class DeleteUserAPIView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "email"
    lookup_url_kwarg = "email"

    def destroy(self, request, *args, **kwargs):
        # logger object for logging.
        logger = config_logging("file download view event: ", logger_obj, logging.INFO)
        # Firstly, delete the user instance as it is the first thing created.
        instance = self.get_object()
        self.perform_destroy(instance)
        # Secondly delete the customer instance as it is the next instance created after user registration.
        try:
            customer_id = Customer.objects.get(email=instance.email).id
            # delete the stripe customer using the API.
            stripe.Customer.delete(customer_id)
            # delete the user home directory in the file system.
            deleted = delete_user_home_dir(instance)
            if deleted:
                # delete the folders associated with the user.
                folders = Folder.objects.filter(owner_email=str(instance.email))
                if folders:
                    folders.delete()
        except Customer.DoesNotExist:
            # if the customer does not exist, then the customer doesn't have a home folder.
            logger.error("The customer with that email address does not exist.")
        return Response(f"{instance.email} was successfully deleted.", status=status.HTTP_204_NO_CONTENT)
