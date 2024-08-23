from rest_framework import serializers

from .models import Campaign, CampaignCategory, CampaignTag, CampaignMedia, CampaignRating, CampaignVisit


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

	class Meta:
		model = Campaign
		fields = [
			'id', 'title', 'description', 'categories', 'tags',
			'location', 'currency', 'goal_amount', 'raised_amount',
			'funding_status', 'project_state', 'investment_type', 'start_date', 'end_date',
			'created_at', 'updated_at', 'creator', 'media', 'ratings'
		]


class LastVisitedCampaignSerializer(serializers.ModelSerializer):
	campaign = CampaignSerializer()

	class Meta:
		model = CampaignVisit
		fields = ['visited_at', 'campaign']
