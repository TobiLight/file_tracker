from rest_framework import serializers
from file_uploads.models import Folder, FileUpload


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ('filename', 'path_to_file', 'file', "folder", 'date_uploaded', 'date_modified')

        read_only_fields = [
            "date_uploaded",
            "date_modified",
        ]


class FolderSerializer(serializers.ModelSerializer):
    # A folder could exist without files, that is, an empty folder could exist, hence, files required=False.
    files = FileUploadSerializer(many=True, required=False)

    class Meta:
        model = Folder
        fields = ('files', 'folder_name', 'path_to_folder', 'date_created', 'date_modified', 'owner_email',
                  'profiles_with_access_rights')
