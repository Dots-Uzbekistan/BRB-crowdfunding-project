from django.db import models


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
        ('declined', 'Declined'),
    ]

    INVESTMENT_TYPE_CHOICES = [
        ('equity', 'Equity'),
        ('debt', 'Debt'),
        ('donation', 'Donation'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    categories = models.ManyToManyField('campaigns.CampaignCategory')
    tags = models.ManyToManyField('campaigns.CampaignTag')
    location = models.CharField(max_length=255)
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    min_investment = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    funding_status = models.CharField(max_length=10, choices=FUNDING_STATUS_CHOICES, default='upcoming')
    project_state = models.CharField(max_length=10, choices=PROJECT_STATE_CHOICES, default='upcoming')
    approval_status = models.CharField(max_length=10, choices=APPROVAL_STATUS_CHOICES, default='pending')
    investment_type = models.CharField(max_length=10, choices=INVESTMENT_TYPE_CHOICES, default='equity')
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='campaigns')

    project_passport = models.FileField(upload_to='campaigns/project_passports/', null=True, blank=True)

    # Fields for Equity-Based Investments
    equity_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                            verbose_name='Equity %', help_text='Total equity offered in %')
    company_valuation = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True,
                                            verbose_name='Company Valuation in USD',
                                            help_text='Valuation of the company (for equity-based campaigns)')

    # Fields for Debt-Based Investments
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                        verbose_name='Interest Rate %',
                                        help_text='Interest rate for debt-based campaigns')
    repayment_period_months = models.IntegerField(null=True, blank=True, verbose_name='Repayment Period (Months)',
                                                  help_text='Repayment period in months for the debt-based campaign')

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Campaigns'

    def __str__(self):
        return self.title


class CampaignMedia(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='media')
    url = models.URLField(null=True, blank=True)
    type = models.CharField(max_length=10, choices=[('image', 'Image'), ('video', 'Video'), ('document', 'Document')])
    file = models.FileField(upload_to=campaign_media_upload_path)

    class Meta:
        verbose_name_plural = 'Campaign Media'

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
        verbose_name_plural = 'Campaign Team Members'

    def __str__(self):
        return f"{self.name} - {self.role}"


class CampaignNews(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='news')
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Campaign News'

    def __str__(self):
        return f"{self.campaign.title} - {self.created_at}"


class CampaignNewsMedia(models.Model):
    campaign_news = models.ForeignKey(CampaignNews, on_delete=models.CASCADE, related_name='media')
    url = models.URLField(null=True, blank=True)
    file = models.FileField(upload_to=campaign_news_media_upload_path)
    type = models.CharField(max_length=10, choices=[('image', 'Image'), ('video', 'Video'), ('document', 'Document')])

    class Meta:
        verbose_name_plural = 'Campaign News Media'

    def __str__(self):
        return f"{self.campaign_news.campaign.title} - {self.type}"


class CampaignCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'Campaign Categories'

    def __str__(self):
        return self.name


class CampaignTag(models.Model):
    name = models.CharField(max_length=255, unique=True)

    class Meta:
        verbose_name_plural = 'Campaign Tags'

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
        verbose_name_plural = 'Campaign Ratings'

    def __str__(self):
        return f"{self.user.email} rated {self.campaign.title} with {self.rating}"


class CampaignVisit(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE, related_name='visits')
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE, related_name='visits')
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-visited_at']
        verbose_name_plural = 'Campaign Visits'

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
        verbose_name_plural = 'Campaign FAQs'

    def __str__(self):
        return f"FAQ for {self.campaign.title}: {self.question}"


class CampaignLike(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    campaign = models.ForeignKey('campaigns.Campaign', on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)  # Timestamp of the first like
    last_liked_at = models.DateTimeField(auto_now=True)  # Timestamp of the last like
    is_active = models.BooleanField(default=True)  # field to track if the like is active

    class Meta:
        verbose_name_plural = 'Campaign Likes'
        unique_together = ('user', 'campaign')

    def __str__(self):
        return f"{self.user.email} liked {self.campaign.title} (Active: {self.is_active})"