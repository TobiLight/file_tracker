# Generated by Django 3.2.9 on 2021-12-15 05:31

from django.db import migrations, models
import file_uploads.models


class Migration(migrations.Migration):

    dependencies = [
        ('file_uploads', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='folder',
            name='owner_email',
            field=models.EmailField(max_length=150, validators=[file_uploads.models.user_email_validator]),
        ),
    ]
