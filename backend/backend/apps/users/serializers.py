from django.utils import timezone
from rest_framework import serializers

from .models import UserProfile
from ..campaigns.models import Campaign


class SavedCampaignSerializer(serializers.ModelSerializer):
    campaign_title = serializers.CharField(source='campaign.title')
    campaign_image = serializers.SerializerMethodField()
    days_left = serializers.SerializerMethodField()
    percent_funded = serializers.SerializerMethodField()
    creator_name = serializers.CharField(source='campaign.creator.name')

    class Meta:
        model = Campaign
        fields = ['campaign_title', 'campaign_image', 'days_left', 'percent_funded', 'creator_name']

    def get_campaign_image(self, obj):
        request = self.context.get('request')
        media = obj.campaign.media.filter(type='image').first()
        if media and media.file:
            return request.build_absolute_uri(media.file.url) if request else media.file.url
        return None

    def get_days_left(self, obj):
        today = timezone.now().date()
        days_left = (obj.campaign.end_date - today).days
        return max(days_left, 0)

    def get_percent_funded(self, obj):
        return (obj.campaign.raised_amount / obj.campaign.goal_amount) * 100


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = UserProfile
        fields = ['profile_image', 'bio', 'phone_number', 'email']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'name', 'surname', 'email', 'phone_number', 'passport_number', 'passport_document',
                    'bio', 'profile_image', 'created_at', 'updated_at', 'role']

    def get_username(self, obj):
        return obj.user.username

    def create(self, validated_data):
        user_id = self.context['request'].user.id
        profile = UserProfile.objects.create(user_id=user_id, **validated_data)
        return profile
