from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.urls import reverse
from plans.models import Plan
from django.db.models.signals import post_save


# Create your models here.
# Users could only login with email address.
# Object manager - in this case, the user object
class UserManager(BaseUserManager):
    # For creating a regular user (frontend create user by calling this method).
    def create_user(self, email, first_name, last_name, password=None):
        if not email:
            raise ValueError("You must provide an email address")
        if not first_name:
            raise ValueError("You must provide a first name")
        if not last_name:
            raise ValueError("You must provide a last name")
        user = self.model(
            email=self.normalize_email(email=email),
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(raw_password=password)
        user.save(using=self._db)
        return user

    # For creating superuser
    def create_superuser(self, email, first_name, last_name, password):
        user = self.create_user(email, first_name, last_name, password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.is_regular = True
        user.is_active = True
        user.save(using=self._db)
        return user


# Creating the user model by inheriting from AbstractBaseUser. AbstractBaseUser only has the default authentication
# but no fields
class User(AbstractBaseUser):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)
    token = models.CharField(max_length=255, null=True, blank=True)

    # Need the required fields for custom user models.
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True, auto_now_add=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_regular = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    # email and password are required by default
    USERNAME_FIELD = "email"

    # For the Frontend
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True


# Creating a user profile model for each registered user
# Represent a user profile.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Field for if a user currently has a plan
    # If user has a plan, the field will be set to True and is_active field in the user model will also be set to True.
    has_plan = models.BooleanField(default=False)
    # deleting the plan, should not delete or impact the user profile. A user/profile could exists without a plan.
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)

    @property
    def email(self):
        return self.user.email

    def __str__(self):
        return "{} Profile".format(self.user.email)


# Create user profile immediately a user registers.
def create_user_profile(sender, **kwargs):
    if kwargs["created"]:
        user = kwargs["instance"]
        # Only create a profile for regular/non admin users.
        if not user.is_admin and not user.is_staff:
            profile = Profile.objects.create(user=user)
            user.is_regular = True
            user.save(update_fields=["is_regular"])


post_save.connect(create_user_profile, sender=User)
