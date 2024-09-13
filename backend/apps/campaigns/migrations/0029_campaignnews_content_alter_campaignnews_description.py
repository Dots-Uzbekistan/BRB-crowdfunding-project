# Generated by Django 5.0.1 on 2024-09-07 15:50

import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0028_collaborationrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaignnews',
            name='content',
            field=django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Content'),
        ),
        migrations.AlterField(
            model_name='campaignnews',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
