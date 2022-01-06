from rest_framework.serializers import (
    EmailField,
    ValidationError,
    ModelSerializer,
    CharField,
)
from django.contrib.auth import get_user_model
from users.models import Profile
from file_uploads.serializers import FolderSerializer
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


# default user serializer
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "last_login",
            "is_superuser",
            "is_admin",
            "is_regular",
            "is_staff",
            "is_active",
        ]


class UserCreateSerializer(ModelSerializer):
    password2 = CharField(required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
            "password2",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password2(self, value):
        data = self.get_initial()
        password1 = data.get("password")
        password2 = value
        if password1 != password2:
            raise ValidationError("Password does not match.")
        return "Confirmed"

    # Possibly need to override this method because it's for creating a new user. Normally don't have to override the
    # method when using a ModelSerializer.
    def create(self, validated_data):
        email = validated_data["email"]
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        password = validated_data["password"]
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
        )
        user.set_password(password)
        user.save()
        return validated_data


class UserLoginSerializer(ModelSerializer):
    token = CharField(allow_blank=True, read_only=True)
    email = EmailField(label="email", required=True, allow_blank=False)
    first_name = CharField(required=False)
    last_name = CharField(required=False)

    class Meta:
        model = User
        fields = [
            "token",
            "email",
            "password",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        email = data["email"]
        password = data["password"]
        # first_name = data["first_name"]
        # last_name = data["last_name"]

        if not email:
            raise ValidationError("An email address is required to login.")
        user = User.objects.get(email=email)
        if user:
            # Will always be true.
            if user.email == email:
                if not user.check_password(password):
                    raise ValidationError("Incorrect password. Please try again.")
            else:
                raise ValidationError("User details does not match the existing data on record.")
        else:
            raise ValidationError("User with that email does not exists.")
        return data


class ChangePasswordSerializer(ModelSerializer):
    password = CharField(write_only=True, required=True, validators=[validate_password])
    password2 = CharField(write_only=True, required=True)
    old_password = CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise ValidationError({"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance


class ProfileSerializer(ModelSerializer):
    user = UserSerializer(required=True)
    # A user profile could exist without folders, hence, folders required=False.
    folders = FolderSerializer(many=True, required=False)

    class Meta:
        model = Profile
        fields = [
            "user",
            "has_plan",
            "folders"
        ]


class AdminUserCreateSerializer(ModelSerializer):
    password2 = CharField(required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
            "password2",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password2(self, value):
        data = self.get_initial()
        password1 = data.get("password")
        password2 = value
        if password1 != password2:
            raise ValidationError("Password does not match.")
        return "Confirmed"

    # Possibly need to override this method because it's for creating a new user. Normally don't have to override the
    # method when using a ModelSerializer.
    def create(self, validated_data):
        email = validated_data["email"]
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        password = validated_data["password"]
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            is_admin=True,
            is_staff=True
        )
        user.set_password(password)
        user.save()
        return validated_data
