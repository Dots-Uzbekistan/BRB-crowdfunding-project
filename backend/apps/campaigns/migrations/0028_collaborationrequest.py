# Generated by Django 5.0.1 on 2024-09-07 14:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0027_alter_campaign_pitch'),
        ('users', '0007_alter_userprofile_passport_number_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CollaborationRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending', max_length=10)),
                ('message', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('responded_at', models.DateTimeField(blank=True, null=True)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_collaborations', to='users.userprofile')),
                ('receiver_campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_collaboration_requests', to='campaigns.campaign')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_collaborations', to='users.userprofile')),
                ('sender_campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_collaboration_requests', to='campaigns.campaign')),
            ],
            options={
                'verbose_name': 'Collaboration Request',
                'verbose_name_plural': 'Collaboration Requests',
                'unique_together': {('sender_campaign', 'receiver_campaign')},
            },
        ),
    ]
