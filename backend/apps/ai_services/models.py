from django.db import models

from apps.campaigns.models import Campaign


class ModerationLog(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='moderation_logs')
    original_details = models.JSONField()
    modified_details = models.JSONField()
    action = models.CharField(choices=[('requires_admin_review', 'Requires admin review'),
                                       ('does_not_require_admin_review', 'Does not require admin review'),
                                       ('block_changes', 'Block changes')], max_length=50)
    reason = models.TextField()
    comparison = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def campaign__name(self):
        return self.campaign.name

    def campaign__approval_status(self):
        return self.campaign.approval_status

    def __str__(self):
        return f"{self.action} - {self.created_at}"

    class Meta:
        verbose_name_plural = 'Moderation Logs'
        verbose_name = 'Moderation Log'
