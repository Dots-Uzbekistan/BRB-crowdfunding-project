from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

from apps.users.models import UserProfile


def campaign_media_upload_path(instance, filename):
    return f'campaigns/campaign_media/{instance.campaign.id}/{filename}'


def campaign_news_media_upload_path(instance, filename):
    return f'campaigns/campaign_news_media/{instance.campaign_news.campaign.id}/{filename}'


def campaign_team_member_profile_picture_upload_path(instance, filename):
    return f'campaigns/team_members/{instance.campaign.id}/{filename}'


class Campaign(models.Model):
    CURRENCY_CHOICES = [
        ('usd', 'USD'),
        ('uzs', 'UZS'),
    ]

    FUNDING_STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('live', 'Live'),
        ('successful', 'Successful'),
    ]

    PROJECT_STATE_CHOICES = [
        ('concept', 'Concept'),
        ('prototype', 'Prototype'),
        ('production', 'Production'),
        ('launched', 'Launched'),
    ]

    # для админки
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    INVESTMENT_TYPE_CHOICES = [
        ('equity', 'Equity'),
        ('debt', 'Debt'),
        ('donation', 'Donation'),
    ]

    name = models.CharField(max_length=255, blank=True, verbose_name='Project Name')
    description = models.TextField(verbose_name='Short Description', max_length=255)
    categories = models.ManyToManyField('campaigns.CampaignCategory')
    project_state = models.CharField(max_length=10, choices=PROJECT_STATE_CHOICES, default='upcoming')
    location = models.CharField(max_length=255)

    investment_type = models.CharField(max_length=10, choices=INVESTMENT_TYPE_CHOICES, default='equity')
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    extra_info = models.TextField(null=True, blank=True, verbose_name='Extra Information')

    title = models.CharField(max_length=255, blank=True, null=True, verbose_name='Campaign Title')
    pitch = CKEditor5Field('Campaign Pitch', config_name='extends', blank=True, null=True)

    tags = models.ManyToManyField('campaigns.CampaignTag', blank=True)
    valuation_cap = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,
                                        verbose_name='Valuation cap in USD',
                                        help_text='Valuation cap (for equity-based campaigns)')
    min_investment = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    max_goal_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    funding_status = models.CharField(max_length=10, choices=FUNDING_STATUS_CHOICES, default='upcoming')
    approval_status = models.CharField(max_length=10, choices=APPROVAL_STATUS_CHOICES, default='pending')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='campaigns')

    project_passport = models.FileField(upload_to='campaigns/project_passports/', null=True, blank=True)  # deprecated
    equity_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                            verbose_name='Equity %',
                                            help_text='Total equity offered in %')  # deprecated
    # Fields for Debt-Based Investments
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                        verbose_name='Interest Rate %',
                                        help_text='Interest rate for debt-based campaigns')  # deprecated
    repayment_period_months = models.IntegerField(null=True, blank=True, verbose_name='Repayment Period (Months)',
                                                  help_text='Repayment period in months for the debt-based campaign')  # deprecated

    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, default='usd')  # deprecated

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Campaigns'

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.title
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name or self.title


class CampaignMedia(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='media')
    url = models.URLField(null=True, blank=True)
    type = models.CharField(max_length=10, choices=[('image', 'Image'), ('video', 'Video'), ('document', 'Document')])
    file = models.FileField(upload_to=campaign_media_upload_path)

    class Meta:
        verbose_name_plural = 'Media'

    def __str__(self):
        return f"{self.campaign.title} - {self.type}"


class CampaignTeamMember(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='team_members')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=255)
    bio = models.TextField(null=True, blank=True)
    profile_link = models.URLField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to=campaign_team_member_profile_picture_upload_path, null=True,
                                        blank=True)

    class Meta:
        verbose_name_plural = 'Team Members'

    def __str__(self):
        return f"{self.name} - {self.role}"


class CampaignNews(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='news')
    title = models.CharField(max_length=255)
    content = CKEditor5Field('Content', config_name='extends', blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Updates'

    def __str__(self):
        return f"{self.campaign.title} - {self.created_at}"


class CampaignNewsMedia(models.Model):
    campaign_news = models.ForeignKey(CampaignNews, on_delete=models.CASCADE, related_name='media')
    url = models.URLField(null=True, blank=True)
    file = models.FileField(upload_to=campaign_news_media_upload_path)
    type = models.CharField(max_length=10, choices=[('image', 'Image'), ('video', 'Video'), ('document', 'Document')])

    class Meta:
        verbose_name_plural = 'News Media'

    def __str__(self):
        return f"{self.campaign_news.campaign.title} - {self.type}"


class CampaignCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class CampaignTag(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'Tags'

    def __str__(self):
        return self.name


class CampaignRating(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='ratings')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField(choices=RATING_CHOICES)
    comment = models.TextField(null=True, blank=True)
    rated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-rated_at']
        unique_together = ('user', 'campaign')
        verbose_name_plural = 'Ratings'

    def __str__(self):
        return f"{self.user.email} rated {self.campaign.title} with {self.rating}"


class CampaignVisit(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='visits')
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE, related_name='visits')
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-visited_at']
        verbose_name_plural = 'Visits'

    def __str__(self):
        return f"{self.user.email} visited {self.campaign.title} at {self.visited_at}"


class CampaignFAQ(models.Model):
    campaign = models.ForeignKey('Campaign', on_delete=models.CASCADE, related_name='faqs')
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0, help_text="Order of the FAQ")
    is_important = models.BooleanField(default=False, help_text="Mark if this FAQ is important")

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return f"FAQ for {self.campaign.title}: {self.question}"


class CampaignLike(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE, related_name='likes')
    liked_at = models.DateTimeField(auto_now_add=True)  # Timestamp of the first like
    last_liked_at = models.DateTimeField(auto_now=True)  # Timestamp of the last like
    is_active = models.BooleanField(default=True)  # field to track if the like is active

    class Meta:
        verbose_name_plural = 'Likes'
        unique_together = ('user', 'campaign')

    def __str__(self):
        return f"{self.user.email} liked {self.campaign.title} (Active: {self.is_active})"


class CampaignShare(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE, related_name='shares')
    shared_at = models.DateTimeField(auto_now_add=True)
    last_shared_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Shares'

    def __str__(self):
        return f"{self.user.email} shared {self.campaign.title} (Active: {self.is_active})"


class CampaignLink(models.Model):
    PLATFORM_CHOICES = [
        ('telegram', 'Telegram'),
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('linkedin', 'LinkedIn'),
        ('website', 'Website'),
    ]

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='links')
    link = models.URLField()
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES)

    def __str__(self):
        return f"{self.campaign.title} - {self.platform}"

    class Meta:
        verbose_name_plural = 'Links'


class CollaborationRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]

    sender_campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='sent_collaboration_requests')
    receiver_campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE,
                                          related_name='received_collaboration_requests')
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_collaborations')
    receiver = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_collaborations')

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(null=True, blank=True)  # Optional message to the receiver
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    responded_at = models.DateTimeField(null=True, blank=True)  # When the request was responded to (accepted/declined)

    def __str__(self):
        return f"Collaboration Request from {self.sender_campaign.name} to {self.receiver_campaign.name} ({self.status})"

    class Meta:
        verbose_name = 'Collaboration Request'
        verbose_name_plural = 'Collaboration Requests'
        unique_together = ('sender_campaign', 'receiver_campaign')  # Ensures no duplicate collaboration requests


class WithdrawalRequest(models.Model):
    WITHDRAWAL_METHOD_CHOICES = [
        ('card', 'Card'),
        ('bank_account', 'Bank Account'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='withdrawal_requests')
    method = models.CharField(max_length=15, choices=WITHDRAWAL_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    commission = models.DecimalField(max_digits=10, decimal_places=2, default=0.05)  # 5% commission
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')

    # Card details (optional)
    card_number = models.CharField(max_length=16, null=True, blank=True)

    # Bank account details (optional)
    account_type = models.CharField(max_length=10, choices=[('savings', 'Savings'), ('debit', 'Debit')], null=True,
                                    blank=True)
    name_on_account = models.CharField(max_length=255, null=True, blank=True)
    account_number = models.CharField(max_length=255, null=True, blank=True)
    routing_number = models.CharField(max_length=255, null=True, blank=True)
    bank_name = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Withdrawal Request for {self.campaign.title} - {self.status}"

    class Meta:
        verbose_name = 'Withdrawal Request'
        verbose_name_plural = 'Withdrawal Requests'
