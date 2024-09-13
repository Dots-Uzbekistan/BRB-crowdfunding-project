# Generated by Django 5.1 on 2024-08-27 13:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_userprofile_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='role',
            field=models.CharField(choices=[('investor', 'Investor'), ('creator', 'Creator')], default='creator', max_length=255),
        ),
    ]
