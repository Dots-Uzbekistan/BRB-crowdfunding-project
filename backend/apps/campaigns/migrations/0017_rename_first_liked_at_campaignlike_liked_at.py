# Generated by Django 5.1 on 2024-08-29 12:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0016_campaignlike'),
    ]

    operations = [
        migrations.RenameField(
            model_name='campaignlike',
            old_name='first_liked_at',
            new_name='liked_at',
        ),
    ]
