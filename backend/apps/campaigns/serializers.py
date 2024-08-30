from django.utils import timezone
from rest_framework import serializers

from .models import Campaign, CampaignCategory, CampaignTag, CampaignMedia, CampaignRating, CampaignVisit, \
    CampaignNewsMedia, CampaignNews, CampaignFAQ, CampaignLike
from ..users.models import UserProfile, UserSavedCampaign


class CampaignInvestmentSerializer(serializers.ModelSerializer):
    min_investment = serializers.DecimalField(max_digits=10, decimal_places=2)
    full_name = serializers.SerializerMethodField()
    campaign_name = serializers.CharField(source='title')
    address = serializers.CharField(source='location')

    class Meta:
        model = Campaign
        fields = ['min_investment', 'full_name', 'campaign_name', 'address']

    def get_full_name(self, obj):
        user = self.context['request'].user.userprofile
        return f"{user.name} {user.surname}" if user else None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['min_investment'] = format(instance.min_investment, '.0f')
        return representation


class CampaignSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSavedCampaign
        fields = ['user', 'campaign', 'saved_at', 'last_saved_at', 'is_active']


class CampaignLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignLike
        fields = ['id', 'user', 'campaign', 'liked_at', 'last_liked_at', 'is_active']


class CampaignFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignFAQ
        fields = ['id', 'question', 'answer', 'order', 'is_important']


class CampaignNewsMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignNewsMedia
        fields = ['id', 'url', 'type', 'file']


class CampaignNewsSerializer(serializers.ModelSerializer):
    update_number = serializers.SerializerMethodField()

    class Meta:
        model = CampaignNews
        fields = ['id', 'title', 'description', 'created_at', 'update_number']

    def get_update_number(self, obj):
        # Get the queryset of all updates for the campaign
        campaign_updates = CampaignNews.objects.filter(campaign=obj.campaign).order_by('created_at')
        # Return the position (index + 1) of the current update in that list
        return list(campaign_updates).index(obj) + 1


class CampaignNewsDetailSerializer(serializers.ModelSerializer):
    media = CampaignNewsMediaSerializer(many=True)

    class Meta:
        model = CampaignNews
        fields = ['id', 'title', 'description', 'created_at', 'media']


class CampaignCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignCategory
        fields = ['id', 'name']


class CampaignTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignTag
        fields = ['id', 'name']


class CampaignMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignMedia
        fields = ['id', 'url', 'type', 'file']


class CampaignCreatorSerializer(serializers.ModelSerializer):
    campaigns_count = serializers.IntegerField(source='campaigns.count')

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'bio', 'campaigns_count', 'profile_image']


class CampaignDetailSerializer(serializers.ModelSerializer):
    media = CampaignMediaSerializer(many=True)
    categories = CampaignCategorySerializer(many=True)
    tags = CampaignTagSerializer(many=True)
    creator = CampaignCreatorSerializer()

    percent_raised = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()
    investors_count = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'title', 'categories', 'tags', 'media', 'project_state',
            'location', 'description', 'raised_amount', 'goal_amount',
            'percent_raised', 'days_left', 'investors_count',
            'creator',
        ]

    def get_percent_raised(self, obj):
        return (obj.raised_amount / obj.goal_amount) * 100 if obj.goal_amount else 0

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days
        return max(days_left, 0)

    def get_investors_count(self, obj):
        return obj.investments.values('user').distinct().count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['raised_amount'] = format(instance.raised_amount, '.0f')
        representation['goal_amount'] = format(instance.goal_amount, '.0f')
        representation['percent_raised'] = format(self.get_percent_raised(instance), '.0f')
        return representation


class CampaignRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignRating
        fields = ['id', 'user', 'rating', 'comment', 'rated_at']


class CampaignVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignVisit
        fields = ['id', 'user', 'visited_at']


class CampaignSerializer(serializers.ModelSerializer):
    categories = CampaignCategorySerializer(many=True)
    tags = CampaignTagSerializer(many=True)
    media = CampaignMediaSerializer(many=True)
    ratings = CampaignRatingSerializer(many=True)
    creator = CampaignCreatorSerializer()

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 'categories', 'tags',
            'location', 'currency', 'goal_amount', 'raised_amount', 'min_investment',
            'funding_status', 'project_state', 'investment_type', 'start_date', 'end_date',
            'created_at', 'updated_at', 'creator', 'media', 'ratings',
            'project_passport',
            'equity_percentage', 'company_valuation',  # For equity-based campaigns
            'interest_rate', 'repayment_period_months'  # For debt-based campaigns
        ]

    def to_representation(self, instance):
        """Customize the representation of the serialized data."""
        representation = super().to_representation(instance)
        if instance.investment_type == 'equity':
            # Include equity-related fields
            representation['equity_percentage'] = instance.equity_percentage
            representation['company_valuation'] = instance.company_valuation
        elif instance.investment_type == 'debt':
            # Include debt-related fields
            representation['interest_rate'] = instance.interest_rate
            representation['repayment_period_months'] = instance.repayment_period_months
        else:
            # If it's neither equity nor debt, exclude these fields
            representation.pop('equity_percentage', None)
            representation.pop('company_valuation', None)
            representation.pop('interest_rate', None)
            representation.pop('repayment_period_months', None)
        return representation


class LastVisitedCampaignSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer()

    class Meta:
        model = CampaignVisit
        fields = ['visited_at', 'campaign']
