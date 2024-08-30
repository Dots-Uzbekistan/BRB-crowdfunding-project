from django.db import models


class Investment(models.Model):
	user = models.ForeignKey('authentication.AuthUser', on_delete=models.CASCADE)
	campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE, related_name='investments')
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	address = models.CharField(max_length=255)
	investment_date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user.username} invested {self.amount} in {self.campaign.title}"


class Transaction(models.Model):
	investment = models.ForeignKey(Investment, on_delete=models.CASCADE)
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	transaction_date = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.investment.user.email} - {self.amount}"


class Payment(models.Model):
	investment = models.ForeignKey(Investment, on_delete=models.CASCADE)
	payment_method = models.CharField(max_length=255)
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	status = models.CharField(max_length=255)
	payment_date = models.DateTimeField(auto_now_add=True)
	confirmed_at = models.DateTimeField(null=True, blank=True)
	api_response = models.TextField(null=True, blank=True)

	def __str__(self):
		return f"{self.payment_method} - {self.amount}"
