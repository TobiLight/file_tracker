# Generated by Django 3.2.9 on 2021-12-26 10:11

from django.db import migrations, models
import django.db.models.deletion
import file_uploads.models


class Migration(migrations.Migration):

    dependencies = [
        ('file_uploads', '0004_alter_folder_owner_email'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.CharField(max_length=150)),
                ('path_to_file', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to=file_uploads.models.file_upload_path)),
                ('date_uploaded', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('folder', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='file_uploads.folder')),
            ],
        ),
    ]
