# Generated by Django 5.0.1 on 2024-09-05 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0023_alter_campaign_end_date_alter_campaign_start_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='tags',
            field=models.ManyToManyField(blank=True, to='campaigns.campaigntag'),
        ),
    ]
