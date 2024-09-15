from django.utils import timezone
from rest_framework import serializers

from .models import CampaignRating, CampaignVisit, CampaignNewsMedia, CampaignNews, CampaignFAQ, CampaignLike, \
    CampaignCategory, CampaignTag, CampaignMedia, Campaign, CampaignLink, CampaignTeamMember
from ..users.models import UserProfile, UserSavedCampaign


class CampaignTeamMemberCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignTeamMember
        fields = ['name', 'role', 'email', 'profile_picture']


class CampaignTeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignTeamMember
        fields = ['id', 'name', 'email', 'role', 'bio', 'profile_link', 'profile_picture']


class CampaignLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignLink
        fields = ['platform', 'link']

    def to_internal_value(self, data):
        if isinstance(data, list):
            return [super().to_internal_value(item) for item in data]
        return super().to_internal_value(data)


class FounderCampaignDetailsMediaSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()

    class Meta:
        model = CampaignMedia
        fields = ['image', 'video']

    def get_image(self, obj):
        request = self.context.get('request')
        last_image = CampaignMedia.objects.filter(campaign=obj.campaign, type='image').last()
        return request.build_absolute_uri(last_image.file.url) if last_image and last_image.file else None

    def get_video(self, obj):
        request = self.context.get('request')
        last_video = CampaignMedia.objects.filter(campaign=obj.campaign, type='video').last()
        return request.build_absolute_uri(last_video.file.url) if last_video and last_video.file else None


class FounderCampaignMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignMedia
        fields = ['file', 'type']
        extra_kwargs = {
            'type': {'required': True}
        }

    def validate_type(self, value):
        if value not in ['image', 'video']:
            raise serializers.ValidationError("Type must be either 'image' or 'video'.")
        return value


class FounderCampaignListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['id', 'name']


class CampaignEditSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=CampaignCategory.objects.all(), many=True, required=False)
    tags = serializers.PrimaryKeyRelatedField(queryset=CampaignTag.objects.all(), many=True, required=False)

    class Meta:
        model = Campaign
        fields = [
            'name', 'description', 'categories', 'project_state', 'location', 'investment_type', 'goal_amount',
            'extra_info', 'title', 'tags', 'valuation_cap', 'min_investment', 'max_goal_amount',
            'start_date', 'end_date'
        ]

    def validate_name(self, value):
        user = self.context['request'].user.profile
        if Campaign.objects.filter(name=value, creator=user).exists():
            raise serializers.ValidationError("You already have a campaign with this name.")
        return value


class CampaignEditSuccessSerializer(serializers.Serializer):
    message = serializers.CharField()
    campaign_id = serializers.IntegerField()


class CampaignRegistrationSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=CampaignCategory.objects.all(), many=True)

    class Meta:
        model = Campaign
        fields = ['name', 'description', 'categories', 'project_state', 'location', 'investment_type', 'goal_amount',
                  'extra_info']

    def validate_name(self, value):
        user = self.context['request'].user.profile
        if Campaign.objects.filter(name=value, creator=user).exists():
            raise serializers.ValidationError("You already have a campaign with this name.")
        return value


class CampaignRegistrationSuccessSerializer(serializers.Serializer):
    message = serializers.CharField()
    campaign_id = serializers.IntegerField()


class ValidationErrorSerializer(serializers.Serializer):
    name = serializers.ListField(
        child=serializers.CharField()
    )


class CampaignInvestmentSerializer(serializers.ModelSerializer):
    min_investment = serializers.DecimalField(max_digits=10, decimal_places=2)
    full_name = serializers.SerializerMethodField()
    campaign_name = serializers.CharField(source='title')
    address = serializers.CharField(source='location')

    class Meta:
        model = Campaign
        fields = ['min_investment', 'full_name', 'campaign_name', 'address']

    def get_full_name(self, obj):
        user = self.context['request'].user.profile
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
    days_left = serializers.SerializerMethodField()
    percent_raised = serializers.SerializerMethodField()

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days
        return max(days_left, 0)

    def get_percent_raised(self, obj):
        return format((obj.raised_amount / obj.goal_amount) * 100, '.0f') if obj.goal_amount else 0

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 'categories', 'tags',
            'location', 'currency', 'goal_amount', 'raised_amount', 'min_investment',
            'funding_status', 'project_state', 'investment_type', 'start_date', 'end_date',
            'created_at', 'updated_at', 'creator', 'media', 'ratings',
            'project_passport',
            'valuation_cap',  # For equity-based campaigns
            # 'interest_rate', 'repayment_period_months',  # For debt-based campaigns
            'days_left', 'percent_raised'
        ]

    # def to_representation(self, instance):
    #     """Customize the representation of the serialized data."""
    #     representation = super().to_representation(instance)
    #     if instance.investment_type == 'equity':
    #         # Include equity-related fields
    #         representation['equity_percentage'] = instance.equity_percentage
    #         representation['valuation_cap'] = instance.valuation_cap
    #     elif instance.investment_type == 'debt':
    #         # Include debt-related fields
    #         representation['interest_rate'] = instance.interest_rate
    #         representation['repayment_period_months'] = instance.repayment_period_months
    #     else:
    #         # If it's neither equity nor debt, exclude these fields
    #         representation.pop('equity_percentage', None)
    #         representation.pop('valuation_cap', None)
    #         representation.pop('interest_rate', None)
    #         representation.pop('repayment_period_months', None)
    #     return representation


class LastVisitedCampaignSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer()

    class Meta:
        model = CampaignVisit
        fields = ['visited_at', 'campaign']


class FounderCampaignDetailSerializer(serializers.ModelSerializer):
    categories = CampaignCategorySerializer(many=True)
    tags = CampaignTagSerializer(many=True)
    media = FounderCampaignDetailsMediaSerializer(many=True)

    class Meta:
        model = Campaign
        fields = [
            'id', 'name', 'title', 'description', 'categories', 'tags', 'media', 'project_state',
            'location', 'investment_type', 'goal_amount', 'raised_amount', 'min_investment', 'max_goal_amount',
            'funding_status', 'approval_status', 'start_date', 'end_date'
        ]
