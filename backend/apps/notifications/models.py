from django.db import models


class Notification(models.Model):
	user = models.ForeignKey('authentication.AuthUser', on_delete=models.CASCADE)
	message = models.TextField()
	is_read = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user.email} - {self.message[:20]}"
