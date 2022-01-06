from django.urls import path
from file_uploads.views import (
    FolderCreateAPIView,
    FileUploadView,
    FileDeleteAPIView,
    FolderDeleteAPIView,
    FileDownloadAPIView,
    ListFileFolderAPIView
)


app_name = "file_uploads"

urlpatterns = [
    path("create-folder/", FolderCreateAPIView.as_view(), name="create_folder"),
    path("file/", FileUploadView.as_view(), name="upload_file"),
    path("delete/file/", FileDeleteAPIView.as_view(), name="delete_file"),
    path("delete/folder/", FolderDeleteAPIView.as_view(), name="delete_folder"),
    # takes url like file-upload/download?path_to_file=user_home/Folder_B&filename=file_b.txt
    path("download/", FileDownloadAPIView.as_view(), name="download_file"),
    # takes url like file-upload/folder/content?path_to_dir=user_home/Folder_B
    path("folder/content/", ListFileFolderAPIView.as_view(), name="folder_content")
]
