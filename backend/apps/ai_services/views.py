from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .schema import TagGenerationOutput, CategoryRecommendationOutput, CollaborationRecommendationOutput, \
    ModerationOutput
from .serializers import TagGenerationRequestSerializer, TagGenerationSerializer, \
    CategoryRecommendationRequestSerializer, CategoryRecommendationSerializer, \
    CollaborationRecommendationRequestSerializer, CollaborationRecommendationSerializer, ModerationRequestSerializer, \
    ModerationSerializer
from .services import TagGenerationService, CategoryRecommendationService, CollaborationRecommendationService, \
    ModerationService


class TagGenerationView(APIView):
    """
    API to generate tags using AI
    """

    @extend_schema(
        request=TagGenerationRequestSerializer,
        responses={200: TagGenerationSerializer},
        description="Generates relevant tags based on the project details"
    )
    def post(self, request):
        data = request.data
        campaign_details = data.get("campaign_details")
        if not campaign_details:
            return Response({"error": "Campaign details are required"}, status=status.HTTP_400_BAD_REQUEST)

        tag_service = TagGenerationService()
        tags: TagGenerationOutput = tag_service.generate_tags(campaign_details)

        return Response(tags.model_dump(), status=status.HTTP_200_OK)


class CategoryRecommendationView(APIView):
    """
    API to recommend a category for a campaign using AI
    """

    @extend_schema(
        request=CategoryRecommendationRequestSerializer,
        responses={200: CategoryRecommendationSerializer},
        description="Recommends a category based on campaign details"
    )
    def post(self, request):
        campaign_details = request.data.get("campaign_details")

        if not campaign_details:
            return Response({"error": "Campaign details and categories are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        category_service = CategoryRecommendationService()
        recommended_category: CategoryRecommendationOutput = category_service.recommend_category(campaign_details)
        return Response(recommended_category.model_dump(), status=status.HTTP_200_OK)


class CollaborationRecommendationView(APIView):
    """
    API to recommend collaborations using AI
    """

    @extend_schema(
        request=CollaborationRecommendationRequestSerializer,
        responses={200: CollaborationRecommendationSerializer},
        description="Recommends potential collaborations based on project details"
    )
    def post(self, request):
        data = request.data
        project1_details = data.get("project1_details")
        project2_details = data.get("project2_details")
        if not project1_details or not project2_details:
            return Response({"error": "Both project details are required"}, status=status.HTTP_400_BAD_REQUEST)

        collaboration_service = CollaborationRecommendationService()
        collaboration: CollaborationRecommendationOutput = collaboration_service.recommend_collaboration(
            project1_details, project2_details)

        return Response(collaboration.model_dump(), status=status.HTTP_200_OK)


class ModerationView(APIView):
    """
    API to moderate changes using AI
    """

    @extend_schema(
        request=ModerationRequestSerializer,
        responses={200: ModerationSerializer},
        description="Moderates changes to project details"
    )
    def post(self, request):
        data = request.data
        original_details = data.get("original_details")
        modified_details = data.get("modified_details")
        if not original_details or not modified_details:
            return Response({"error": "Both original and modified details are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        moderation_service = ModerationService()
        moderation: ModerationOutput = moderation_service.moderate_changes(original_details, modified_details)

        return Response(moderation.model_dump(), status=status.HTTP_200_OK)
