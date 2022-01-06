from django.contrib import admin
from file_uploads.models import Folder, FileUpload


class FileInline(admin.TabularInline):
    model = FileUpload


# Register your models here.
class FolderAdmin(admin.ModelAdmin):
    list_display = ("folder_name", "path_to_folder", "date_created", "owner_email", )
    search_fields = ("folder_name",)
    list_filter = ("folder_name",)
    filter_horizontal = ('profiles_with_access_rights',)
    inlines = (FileInline, )

    class Meta:
        model = Folder


admin.site.register(Folder, FolderAdmin)


class FileUploadAdmin(admin.ModelAdmin):
    list_display = ("filename", "path_to_file", )
    search_fields = ("filename", )
    list_filter = ("filename", )

    class Meta:
        model = FileUpload


admin.site.register(FileUpload, FileUploadAdmin)
