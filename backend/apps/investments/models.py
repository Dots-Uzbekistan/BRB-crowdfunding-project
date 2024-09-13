from django.db import models
from django.utils import timezone


class Investment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='investments')
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE, related_name='investments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    investment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.user.username} invested {self.amount} in {self.campaign.title}"


class Transaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]

    investment = models.ForeignKey(Investment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.investment.user.email} - {self.amount}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]

    investment = models.ForeignKey(Investment, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    api_response = models.TextField(null=True, blank=True)

    def mark_as_successful(self):
        self.status = 'successful'
        self.confirmed_at = timezone.now()
        self.save()

        # Update the status of the related investment and transaction
        self.investment.status = 'successful'
        self.investment.save()

        transaction = Transaction.objects.get(investment=self.investment)
        transaction.status = 'successful'
        transaction.save()

    def mark_as_failed(self):
        self.status = 'failed'
        self.save()

        # Update the status of the related investment and transaction
        self.investment.status = 'failed'
        self.investment.save()

        transaction = Transaction.objects.get(investment=self.investment)
        transaction.status = 'failed'
        transaction.save()

    def __str__(self):
        return f"{self.payment_method} - {self.amount}"
