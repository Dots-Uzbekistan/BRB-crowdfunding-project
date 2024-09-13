from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers

from .models import CampaignRating, CampaignVisit, CampaignNewsMedia, CampaignNews, CampaignFAQ, CampaignLike, \
    CampaignCategory, CampaignTag, CampaignMedia, CampaignLink, CampaignTeamMember, CollaborationRequest, Campaign, \
    WithdrawalRequest
from ..users.models import UserProfile, UserSavedCampaign


class SimpleCategoryRecommendationRequestSerializer(serializers.Serializer):
    name = serializers.CharField(help_text="Name of the campaign")
    title = serializers.CharField(help_text="Title of the campaign")
    description = serializers.CharField(help_text="Description of the campaign")


class CategoryRecommendationSerializer(serializers.Serializer):
    category = serializers.CharField(help_text="Recommended category")


class WithdrawalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithdrawalRequest
        fields = [
            'method',
            'card_number', 'account_type', 'name_on_account',
            'account_number', 'routing_number', 'bank_name'
        ]

    def validate(self, data):
        # Ensure either card or bank details are provided based on method
        method = data.get('method')
        if method == 'card' and not data.get('card_number'):
            raise serializers.ValidationError("Card number is required for card withdrawal.")
        if method == 'bank_account':
            required_fields = ['account_type', 'name_on_account', 'account_number', 'routing_number', 'bank_name']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        f"{field.replace('_', ' ').capitalize()} is required for bank withdrawal.")
        return data


class CampaignFundingStatusSerializer(serializers.Serializer):
    raised_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    commission_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    withdrawal_amount = serializers.DecimalField(max_digits=10, decimal_places=2)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['raised_amount'] = format(float(representation['raised_amount']), '.0f')
        representation['commission_amount'] = format(float(representation['commission_amount']), '.0f')
        representation['withdrawal_amount'] = format(float(representation['withdrawal_amount']), '.0f')
        return representation


class CampaignApprovalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['id', 'title', 'approval_status']


class FounderCampaignNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignNews
        fields = ['title', 'content', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class CollaborationRequestSerializer(serializers.ModelSerializer):
    sender_campaign = serializers.SlugRelatedField(slug_field='name', queryset=Campaign.objects.all())
    receiver_campaign = serializers.SlugRelatedField(slug_field='name', queryset=Campaign.objects.all())
    sender = serializers.CharField(source='sender.user.email', read_only=True)
    receiver = serializers.CharField(source='receiver.user.email', read_only=True)

    class Meta:
        model = CollaborationRequest
        fields = ['id', 'sender_campaign', 'receiver_campaign', 'sender', 'receiver', 'status', 'created_at',
                  'updated_at', 'responded_at']
        read_only_fields = ['status', 'created_at', 'updated_at', 'responded_at']


class CollaborationRequestCreateSerializer(serializers.Serializer):
    target_campaign_id = serializers.IntegerField()


class CampaignPitchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ['pitch']


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
            'pitch',
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
        fields = ['id', 'title', 'content', 'description', 'created_at', 'update_number']

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
    name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'phone_number',
                  'bio', 'campaigns_count', 'profile_image']

    def get_name(self, obj):
        return f"{obj.name} {obj.surname}"


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
        return format((obj.raised_amount / obj.goal_amount) * 100, '.0f') if obj.goal_amount else 'N/A'

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days if obj.end_date else 'N/A'
        return max(days_left, 0) if days_left != 'N/A' else 'N/A'

    def get_investors_count(self, obj):
        return obj.investments.values('user').distinct().count()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['raised_amount'] = format(instance.raised_amount, '.0f')
        representation['goal_amount'] = format(instance.goal_amount, '.0f')
        representation['percent_raised'] = self.get_percent_raised(instance)
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
    label = serializers.SerializerMethodField()

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days if obj.end_date else 'N/A'
        return max(days_left, 0) if days_left != 'N/A' else 'N/A'

    def get_percent_raised(self, obj):
        return format((obj.raised_amount / obj.goal_amount) * 100, '.0f') if obj.goal_amount else 'N/A'

    def get_label(self, obj):
        """
        Logic to assign a label to a campaign:
        - "New this week": created in the past 7 days
        - "Trending this week": has a lot of raised amount in the past 7 days
        - "Almost funded": raised more than 80% of goal amount
        """
        # "New this week" if campaign created in the last 7 days
        if (timezone.now() - obj.created_at).days <= 7:
            return "New this week"

        # "Trending this week" (simple logic for now)
        if obj.raised_amount > 1000:
            return "Trending this week"

        # "Almost funded" if more than 80% of the goal is raised
        if obj.raised_amount >= obj.goal_amount * Decimal('0.8'):
            return "Almost funded"

        return None

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
            'days_left', 'percent_raised',
            'label'
        ]


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
            'id', 'name', 'title', 'description', 'pitch',
            'categories', 'tags', 'media', 'project_state',
            'location', 'investment_type', 'goal_amount', 'raised_amount', 'min_investment', 'max_goal_amount',
            'funding_status', 'approval_status', 'start_date', 'end_date'
        ]


class RecommendedCampaignSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()
    categories = serializers.StringRelatedField(many=True)
    tags = serializers.StringRelatedField(many=True)
    image = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()

    percent_raised = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()

    matching_percentage = serializers.SerializerMethodField()
    collaboration_reason = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            'id', 'title', 'description', 'creator_name',
            'image', 'video',
            'percent_raised', 'days_left',
            'goal_amount', 'raised_amount',
            'start_date', 'end_date', 'funding_status', 'approval_status', 'categories',
            'tags', 'label',
            'matching_percentage', 'collaboration_reason'
        ]

    def get_creator_name(self, obj):
        return f"{obj.creator.name} {obj.creator.surname}" if obj.creator else None

    def get_image(self, obj):
        request = self.context.get('request')
        media = obj.media.filter(type='image').last()
        return request.build_absolute_uri(media.file.url) if media and media.file else None

    def get_video(self, obj):
        request = self.context.get('request')
        media = obj.media.filter(type='video').last()
        return request.build_absolute_uri(media.file.url) if media and media.file else None

    def get_label(self, obj):
        """
        Logic to assign a label to a campaign:
        - "New this week": created in the past 7 days
        - "Trending this week": has a lot of raised amount in the past 7 days
        - "Almost funded": raised more than 80% of goal amount
        """
        # "New this week" if campaign created in the last 7 days
        if (timezone.now() - obj.created_at).days <= 7:
            return "New this week"

        # "Trending this week" (simple logic for now)
        if obj.raised_amount > 1000:
            return "Trending this week"

        # "Almost funded" if more than 80% of the goal is raised
        if obj.raised_amount >= obj.goal_amount * Decimal('0.8'):
            return "Almost funded"

        return None

    def get_percent_raised(self, obj):
        return format((obj.raised_amount / obj.goal_amount) * 100, '.0f') if obj.goal_amount else 'N/A'

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days if obj.end_date else 'N/A'
        return max(days_left, 0) if days_left != 'N/A' else 'N/A'

    def get_matching_percentage(self, obj):
        return obj.matching_percentage if hasattr(obj, 'matching_percentage') else None

    def get_collaboration_reason(self, obj):
        return obj.collaboration_reason if hasattr(obj, 'collaboration_reason') else None


class FounderCampaignSerializer(serializers.ModelSerializer):
    categories = CampaignCategorySerializer(many=True)
    tags = CampaignTagSerializer(many=True)
    media = FounderCampaignDetailsMediaSerializer(many=True)
    ratings = CampaignRatingSerializer(many=True)
    creator = CampaignCreatorSerializer()
    days_left = serializers.SerializerMethodField()
    percent_raised = serializers.SerializerMethodField()

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.end_date - today).days if obj.end_date else 'N/A'
        return max(days_left, 0) if days_left != 'N/A' else 'N/A'

    def get_percent_raised(self, obj):
        return format((obj.raised_amount / obj.goal_amount) * 100, '.0f') if obj.goal_amount else 'N/A'

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


class CampaignCreationStatsSerializer(serializers.Serializer):
    total_campaigns = serializers.IntegerField()
    total_raised = serializers.CharField()
