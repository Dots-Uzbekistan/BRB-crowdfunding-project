from django.contrib import admin
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

from apps.investments.models import Investment, Transaction, Payment
from apps.notifications.models import Notification
from apps.utils import send_notification_email


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'campaign', 'campaign_categories', 'amount', 'status', 'investment_date')
    list_filter = ('status', 'campaign__categories', 'investment_date')
    search_fields = ('user__username', 'campaign__title')
    readonly_fields = ('investment_date',)

    def campaign_categories(self, obj):
        return ", ".join([category.name for category in obj.campaign.categories.all()])

    campaign_categories.short_description = 'Campaign Categories'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('investment', 'amount', 'status', 'transaction_date')
    list_filter = ('status', 'transaction_date')
    search_fields = ('investment__user__username',)
    readonly_fields = ('transaction_date',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('investment', 'payment_method', 'amount', 'status', 'payment_date')
    list_filter = ('status', 'payment_date')
    search_fields = ('investment__user__username',)
    readonly_fields = ('payment_date',)
    actions = ['mark_as_successful', 'mark_as_failed']

    def mark_as_successful(self, request, queryset):
        for payment in queryset:
            if payment.status != 'successful':  # Ensure it is not already marked as successful
                payment.status = 'successful'
                payment.confirmed_at = timezone.now()
                payment.save()

                # Fetch the related investment
                investment = payment.investment
                transaction = investment.transaction_set.first()

                transaction.status = 'successful'
                transaction.save()

                investment.status = 'successful'
                investment.save()

                # Update the raised amount for the campaign
                campaign = investment.campaign
                campaign.raised_amount += payment.amount
                campaign.save()

                self.send_funded_notification(campaign, investment)

        self.message_user(request,
                          "Selected payments marked as successful, transactions and investments updated, and campaign raised amounts updated.")

    mark_as_successful.short_description = "Mark selected payments as successful"

    def mark_as_failed(self, request, queryset):
        for payment in queryset:
            if payment.status != 'failed':
                payment.status = 'failed'
                payment.confirmed_at = timezone.now()
                payment.save()

                investment = payment.investment
                transaction = investment.transaction_set.first()

                transaction.status = 'failed'
                transaction.save()

                investment.status = 'failed'
                investment.save()

        self.message_user(request, "Selected payments marked as failed, transactions and investments updated.")

    mark_as_failed.short_description = "Mark selected payments as failed"

    def send_funded_notification(self, campaign, investment):
        """
        Sends a notification to the campaign creator when the campaign is funded.
        """
        receiver = campaign.creator

        message = f"Your campaign '{campaign.title}' has received an investment of ${investment.amount}."
        subject = f"[Fundflow] Campaign Funded: {campaign.title}"

        Notification.objects.create(
            sender=investment.user,
            receiver=receiver,
            notification_type='campaign_funded',
            message=f"Your campaign '{campaign.title}' has received an investment of ${investment.amount}.",
            content_object=ContentType.objects.get_for_model(investment),
            object_id=investment.id
        )

        try:
            send_notification_email(
                subject=subject,
                message=message,
                recipient_list=[receiver.email]
            )
        except Exception as e:
            print(f"Failed to send email notification to {receiver.email}: {e}")
