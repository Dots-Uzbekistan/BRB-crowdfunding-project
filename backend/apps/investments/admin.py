from django.contrib import admin
from django.utils import timezone

from apps.investments.models import Investment, Transaction, Payment


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
            if payment.status == 'pending':  # Only proceed if the previous status was 'pending'
                payment.status = 'successful'
                payment.confirmed_at = timezone.now()
                payment.save()

                # Automatically mark the corresponding transaction and investment as successful
                transaction = payment.investment.transaction_set.first()
                investment = payment.investment

                transaction.status = 'successful'
                transaction.save()

                investment.status = 'successful'
                investment.save()

                # Update the raised amount for the campaign
                campaign = investment.campaign
                campaign.raised_amount += payment.amount
                campaign.save()

        self.message_user(request,
                          "Selected payments marked as successful, transactions and investments updated, and campaign raised amounts updated.")

    mark_as_successful.short_description = "Mark selected payments as successful"

    def mark_as_failed(self, request, queryset):
        queryset.update(status='failed')
        self.message_user(request, "Selected payments marked as failed.")

    mark_as_failed.short_description = "Mark selected payments as failed"
