from django.contrib import admin
from django.utils.html import format_html

from .models import ModerationLog


@admin.register(ModerationLog)
class ModerationLogAdmin(admin.ModelAdmin):
    list_display = (
        'campaign__name', 'campaign__approval_status', 'action', 'reason', 'view_comparison', 'created_at', 'updated_at'
    )
    list_filter = ('action', 'campaign__approval_status')

    actions = ['approve_campaigns', 'reject_campaigns']

    def approve_campaigns(self, request, queryset):
        """
        Approve the campaigns associated with the selected moderation logs
        """
        for log in queryset:
            log.campaign.approval_status = 'approved'
            log.campaign.save()
            log.action = 'does_not_require_admin_review'
            log.save()

        self.message_user(request, "Selected campaigns have been approved.")

    approve_campaigns.short_description = "Approve selected campaigns"

    def reject_campaigns(self, request, queryset):
        """
        Reject the campaigns associated with the selected moderation logs
        """
        for log in queryset:
            log.campaign.approval_status = 'rejected'
            log.campaign.save()
            log.action = 'requires_admin_review'
            log.reason = 'Rejected by admin'
            log.save()

        self.message_user(request, "Selected campaigns have been rejected.")

    reject_campaigns.short_description = "Reject selected campaigns"

    # Custom method to display a "View Comparison" link in the admin interface
    def view_comparison(self, obj):
        comparison_data = obj.comparison.replace('"', '&quot;')  # Escaping quotes for JS
        return format_html(
            '<a href="#" onclick="window.open(\'\', \'comparison_window\', \'width=800,height=600\').document.write(\'{}\'); return false;">View Comparison</a>',
            comparison_data
        )

    view_comparison.short_description = 'Comparison'
