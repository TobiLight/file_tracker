from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from users.models import User, Profile
from file_uploads.models import Folder


# Register your models here.
class UserCustomAdmin(UserAdmin):
    list_display = (
        "first_name",
        "last_name",
        "email",
        "date_joined",
        "last_login",
        "is_active",
        "is_admin",
        "is_staff",
    )
    search_fields = ["first_name", "last_name", "email"]
    list_filter = ["first_name", "last_name", "email"]
    readonly_fields = ("date_joined", "last_login")
    fieldsets = (
        ("Login data", {"fields": ("email", "password", "token")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_regular",
                    "is_staff",
                    "is_admin",
                    "is_superuser",
                )
            },
        ),
        ("Additional data", {"fields": ("date_joined", "last_login")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                    "is_admin",
                ),
            },
        ),
    )

    ordering = ["-date_joined"]
    filter_horizontal = ()

    class Meta:
        model = User


admin.site.register(User, UserCustomAdmin)


class FolderInline(admin.TabularInline):
    model = Folder.profiles_with_access_rights.through


class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "has_plan", "plan",)
    inlines = [FolderInline, ]

    class Meta:
        model = Profile


admin.site.register(Profile, ProfileAdmin)
