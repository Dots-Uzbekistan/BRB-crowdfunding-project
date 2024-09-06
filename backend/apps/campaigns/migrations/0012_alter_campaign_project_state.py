# Generated by Django 5.1 on 2024-08-23 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0011_campaign_investment_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='project_state',
            field=models.CharField(choices=[('concept', 'Concept'), ('prototype', 'Prototype'), ('production', 'Production'), ('launched', 'Launched')], default='upcoming', max_length=10),
        ),
    ]