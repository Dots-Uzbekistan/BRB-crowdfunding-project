from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from apps.campaigns.models import Campaign
from apps.users.models import UserProfile


class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('admin_message', 'Admin Message'),
        ('campaign_update', 'Campaign Update'),
        ('collaboration_request', 'Collaboration Request'),
        ('campaign_funded', 'Campaign Funded'),
    ]

    sender = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='sent_notifications')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_notifications',
                                 null=True)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE_CHOICES, default='admin_message')
    message = models.TextField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # link the notification to other models (campaigns, collaboration requests, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification from {self.sender} to {self.receiver} ({self.notification_type})"

    def mark_as_read(self):
        self.is_read = True
        self.save()
