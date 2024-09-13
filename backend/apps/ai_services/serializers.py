from rest_framework import serializers


class TagGenerationRequestSerializer(serializers.Serializer):
    campaign_details = serializers.JSONField(help_text="Details about the campaign to generate tags")


class CategoryRecommendationRequestSerializer(serializers.Serializer):
    campaign_details = serializers.JSONField(help_text="Details about the campaign to recommend categories")


class CollaborationRecommendationRequestSerializer(serializers.Serializer):
    project1_details = serializers.JSONField(help_text="Details about the first project")
    project2_details = serializers.JSONField(help_text="Details about the second project")


class ModerationRequestSerializer(serializers.Serializer):
    original_details = serializers.JSONField(help_text="Original project details")
    modified_details = serializers.JSONField(help_text="Modified project details")


class TagGenerationSerializer(serializers.Serializer):
    tags = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of generated tags"
    )


class CategoryRecommendationSerializer(serializers.Serializer):
    category = serializers.CharField(help_text="Recommended category")
    not_enough_info = serializers.BooleanField(
        help_text="Indicates if there is enough information to generate categories"
    )


class CollaborationRecommendationSerializer(serializers.Serializer):
    verdict = serializers.CharField(help_text="Collaboration verdict (yes or no)")
    matching_percentage = serializers.IntegerField(help_text="Matching percentage")
    reason = serializers.CharField(help_text="Short reason for the verdict")


class ModerationSerializer(serializers.Serializer):
    action = serializers.CharField(
        help_text="Moderation action (requires_admin_review, does_not_require_admin_review, block_changes)"
    )
    reason = serializers.CharField(help_text="Short reason for the moderation decision")
