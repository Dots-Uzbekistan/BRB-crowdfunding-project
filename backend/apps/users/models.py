from datetime import datetime

from django.db import models

from apps.authentication.models import AuthUser


def user_profile_passport_upload_path(instance, filename):
    return f'users/user_profile/passport_documents/{instance.user.id}/{datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}-{filename}'


def user_profile_image_upload_path(instance, filename):
    return f'users/user_profile/profile_images/{instance.user.id}/{datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}-{filename}'


class UserProfile(models.Model):
    user = models.OneToOneField('authentication.AuthUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, unique=True)
    passport_number = models.CharField(max_length=255, unique=True, null=True, blank=True)
    passport_document = models.FileField(upload_to=user_profile_passport_upload_path, null=True, blank=True)
    profile_image = models.ImageField(upload_to=user_profile_image_upload_path, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    role = models.CharField(max_length=255, choices=[('investor', 'Investor'), ('creator', 'Creator')],
                            default='creator')
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return self.email


class UserSavedCampaign(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)
    last_saved_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'User Saved Campaigns'
        unique_together = ('user', 'campaign')

    def __str__(self):
        return f"{self.user.email} saved {self.campaign.title}"
