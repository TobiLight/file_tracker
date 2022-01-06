from django.urls import path
from users.views import (
    UserCreateAPIView,
    UserLoginAPIView,
    UserLogoutView,
    CheckPlanAPIView,
    ProfileDetailAPIView,
    AdminUserCreateAPIView,
    ListUserProfileAPIView,
    DeleteUserAPIView,
    ChangePasswordView,
)

app_name = "users"

urlpatterns = [
    path("register/", UserCreateAPIView.as_view(), name="regular_user_register"),
    path("login/", UserLoginAPIView.as_view(), name="user_login"),
    path("logout/", UserLogoutView.as_view(), name="user_logout"),
    path("has-plan/<path:email>/", CheckPlanAPIView.as_view(), name="user_has_plan"),
    path("profile/<path:email>/", ProfileDetailAPIView.as_view(), name="user_profile"),
    path("admin/register/", AdminUserCreateAPIView.as_view(), name="admin_user_register"),
    path("admin/list/profiles/", ListUserProfileAPIView.as_view(), name="admin_list_profiles"),
    path("admin/delete-profile/<path:email>/", DeleteUserAPIView.as_view(), name="admin_delete_profile"),
    path('change-password/<path:email>/', ChangePasswordView.as_view(), name='auth_change_password'),  # Use put method.
]
