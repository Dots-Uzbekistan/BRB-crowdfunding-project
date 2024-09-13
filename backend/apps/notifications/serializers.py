from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

from apps.campaigns.models import CollaborationRequest, CampaignNews
from apps.investments.models import Investment
from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    collaboration_request_id = serializers.SerializerMethodField()
    campaign_news_id = serializers.SerializerMethodField()
    campaign_id = serializers.SerializerMethodField()
    investment_id = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'message', 'is_read', 'created_at',
                  'collaboration_request_id', 'campaign_news_id', 'campaign_id', 'investment_id']

    def get_collaboration_request_id(self, obj):
        if obj.content_type == ContentType.objects.get_for_model(CollaborationRequest):
            return obj.object_id
        return None

    def get_campaign_news_id(self, obj):
        if obj.content_type == ContentType.objects.get_for_model(CampaignNews):
            return obj.object_id
        return None

    def get_campaign_id(self, obj):
        if obj.content_type == ContentType.objects.get_for_model(CollaborationRequest):
            collaboration_request = CollaborationRequest.objects.get(id=obj.object_id)
            return collaboration_request.receiver_campaign.id
        elif obj.content_type == ContentType.objects.get_for_model(CampaignNews):
            campaign_news = CampaignNews.objects.get(id=obj.object_id)
            return campaign_news.campaign.id
        elif obj.content_type == ContentType.objects.get_for_model(Investment):
            investment = Investment.objects.get(id=obj.object_id)
            return investment.campaign.id
        return None

    def get_investment_id(self, obj):
        if obj.content_type == ContentType.objects.get_for_model(Investment):
            return obj.object_id
        return None
