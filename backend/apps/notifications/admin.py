from django import forms
from django.contrib import admin

from .models import Notification


class NotificationAdminForm(forms.ModelForm):
    """
    Custom form for NotificationAdmin to add sending functionality.
    """

    class Meta:
        model = Notification
        fields = '__all__'

    def save(self, commit=True):
        notification = super().save(commit=False)

        # todo: integrate with a messaging service or email notification service
        if commit:
            notification.save()
        return notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    form = NotificationAdminForm

    list_display = (
        'sender', 'receiver', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read')
    search_fields = ('receiver__email', 'sender__email', 'message')

    fields = (
        'sender', 'receiver', 'notification_type', 'message', 'is_read', 'content_type', 'object_id', 'created_at')
    readonly_fields = ('created_at',)

    actions = ['send_notification']

    def send_notification(self, request, queryset):
        """
        Custom action to send notifications to users.
        """
        for notification in queryset:
            # integrate with an email or messaging service
            self.message_user(request, f"Notification sent to {notification.receiver.email}")

    send_notification.short_description = 'Send selected notifications'
