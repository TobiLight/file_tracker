from django.contrib import admin
from plans.models import Plan
from users.models import Profile


# Register your models here.
class ProfileInline(admin.TabularInline):
    model = Profile


class PlanAdmin(admin.ModelAdmin):
    list_display = ("plan_name", "max_number_invites", "storage_size", )
    search_fields = ("plan_name",)
    list_filter = ("plan_name",)
    inlines = (ProfileInline,)

    class Meta:
        model = Plan


admin.site.register(Plan, PlanAdmin)
