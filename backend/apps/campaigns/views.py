from datetime import timedelta
from decimal import Decimal

from django.contrib.contenttypes.models import ContentType
from django.db.models import Max, F, Q, Sum, Count
from django.db.models.functions import TruncMonth
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django_filters import rest_framework as filters
from drf_spectacular.utils import OpenApiResponse, OpenApiExample, extend_schema, OpenApiParameter
from rest_framework import status, generics
from rest_framework.exceptions import NotFound
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.campaigns.models import WithdrawalRequest, Campaign, CampaignVisit, CampaignLike, CampaignShare
from apps.campaigns.serializers import CampaignSerializer, FounderCampaignSerializer, \
    WithdrawalRequestSerializer, SimpleCategoryRecommendationRequestSerializer, CategoryRecommendationSerializer, \
    CampaignCreationStatsSerializer
from .models import CampaignCategory, CampaignTag, CampaignRating, CampaignNews, CampaignFAQ, \
    CampaignMedia, CampaignLink, CampaignTeamMember, CollaborationRequest
from .serializers import CampaignCategorySerializer, CampaignTagSerializer, CampaignVisitSerializer, \
    CampaignRatingSerializer, LastVisitedCampaignSerializer, CampaignDetailSerializer, CampaignNewsSerializer, \
    CampaignNewsDetailSerializer, CampaignFAQSerializer, CampaignInvestmentSerializer, CampaignRegistrationSerializer, \
    CampaignRegistrationSuccessSerializer, ValidationErrorSerializer, CampaignEditSerializer, \
    CampaignEditSuccessSerializer, FounderCampaignDetailSerializer, FounderCampaignListSerializer, \
    FounderCampaignMediaSerializer, CampaignLinkSerializer, CampaignTeamMemberSerializer, \
    CampaignTeamMemberCreateSerializer, CampaignPitchSerializer, RecommendedCampaignSerializer, \
    CollaborationRequestSerializer, CollaborationRequestCreateSerializer, FounderCampaignNewsSerializer, \
    CampaignApprovalStatusSerializer, CampaignFundingStatusSerializer
from ..ai_services.services import TagGenerationService, CategoryRecommendationService, \
    CollaborationRecommendationService, ModerationService
from ..investments.models import Investment
from ..notifications.models import Notification
from ..users.models import UserSavedCampaign, UserProfile
from ..utils import send_notification_email


class FounderDashboardStatsView(APIView):
    """
    API for retrieving advanced stats for the founder's campaign dashboard.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Retrieve advanced statistics for the campaign dashboard.",
        responses={
            200: OpenApiResponse(
                response={
                    "type": "object",
                    "properties": {
                        "total_raised_funds": {
                            "type": "number",
                            "example": 7300
                        },
                        "total_visits": {
                            "type": "integer",
                            "example": 12754
                        },
                        "total_investors": {
                            "type": "integer",
                            "example": 72
                        },
                        "campaign_visits_rate": {
                            "type": "object",
                            "properties": {
                                "labels": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "example": ["January", "February", "March", "April"]
                                },
                                "data": {
                                    "type": "array",
                                    "items": {"type": "integer"},
                                    "example": [500, 600, 750, 800]
                                }
                            }
                        },
                        "total_likes": {
                            "type": "integer",
                            "example": 7300
                        },
                        "total_shares": {
                            "type": "integer",
                            "example": 732
                        },
                        "total_saves": {
                            "type": "integer",
                            "example": 72
                        },
                        "campaign_saves_rate": {
                            "type": "object",
                            "properties": {
                                "labels": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "example": ["January", "February", "March", "April"]
                                },
                                "data": {
                                    "type": "array",
                                    "items": {"type": "integer"},
                                    "example": [200, 300, 500, 600]
                                }
                            }
                        },
                        "days_left": {
                            "type": "integer",
                            "example": 34
                        },
                        "percent_raised": {
                            "type": "string",
                            "example": "73"
                        }
                    }
                },
                description="Statistics for the campaign dashboard."
            )
        }
    )
    def get(self, request, campaign_id):
        # Retrieve the campaign
        campaign = get_object_or_404(Campaign, id=campaign_id, creator=request.user.profile)

        # Total raised funds
        total_raised_funds = campaign.raised_amount

        # Total visits to campaign page
        total_visits = CampaignVisit.objects.filter(campaign=campaign).count()

        # Total number of investors
        total_investors = Investment.objects.filter(campaign=campaign).values('user').distinct().count()

        # Campaign page visits rate (for chart)
        visits_rate_data = self.get_visits_rate_data(campaign)

        # Total likes
        total_likes = CampaignLike.objects.filter(campaign=campaign).count()

        # Total shares
        total_shares = CampaignShare.objects.filter(campaign=campaign).count()

        # Total saves
        total_saves = UserSavedCampaign.objects.filter(campaign=campaign).count()

        # Campaign saves rate (for chart)
        saves_rate_data = self.get_saves_rate_data(campaign)

        # Days left until deadline
        days_left = (campaign.end_date - timezone.now().date()).days if campaign.end_date else 'N/A'

        percent_raised = format((total_raised_funds / campaign.goal_amount) * 100,
                                '.0f') if campaign.goal_amount else 'N/A'

        # Response data
        data = {
            "total_raised_funds": total_raised_funds,
            "total_visits": total_visits,
            "total_investors": total_investors,
            "campaign_visits_rate": visits_rate_data,
            "total_likes": total_likes,
            "total_shares": total_shares,
            "total_saves": total_saves,
            "campaign_saves_rate": saves_rate_data,
            "days_left": days_left,
            "percent_raised": percent_raised
        }

        return Response(data, status=200)

    def get_visits_rate_data(self, campaign):
        # Query to get visits grouped by month for the campaign
        visits_by_month = CampaignVisit.objects.filter(campaign=campaign).annotate(
            month=TruncMonth('visited_at')).values('month').annotate(count=Count('id'))
        labels = [visit['month'].strftime('%B') for visit in visits_by_month]
        data = [visit['count'] for visit in visits_by_month]
        return {"labels": labels, "data": data}

    def get_saves_rate_data(self, campaign):
        # Query to get saves grouped by month for the campaign
        saves_by_month = UserSavedCampaign.objects.filter(campaign=campaign).annotate(
            month=TruncMonth('saved_at')).values('month').annotate(count=Count('id'))
        labels = [save['month'].strftime('%B') for save in saves_by_month]
        data = [save['count'] for save in saves_by_month]
        return {"labels": labels, "data": data}


class CampaignCreationStatsView(APIView):
    """
    API to get statistics about campaigns, including total number of campaigns and total amount raised.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CampaignCreationStatsSerializer

    def get(self, request):
        total_campaigns = Campaign.objects.filter(raised_amount__gt=0).count()

        total_raised = Campaign.objects.aggregate(Sum('raised_amount'))['raised_amount__sum'] or 0

        if total_raised >= 1000:
            formatted_raised = f"${total_raised / 1000:.0f}k"
        else:
            formatted_raised = f"${total_raised}"

        stats = {
            'total_campaigns': total_campaigns,
            'total_raised': formatted_raised
        }

        return Response(stats, status=200)


class WithdrawalRequestView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Submit a withdrawal request for the specified campaign.",
        request=WithdrawalRequestSerializer,
        responses={201: WithdrawalRequestSerializer},
        parameters=[
            OpenApiParameter("campaign_id", type=int, location=OpenApiParameter.PATH,
                             description="Campaign ID for which to request withdrawal")
        ],
        examples=[
            OpenApiExample(
                'Example 1 - Card Withdrawal',
                description="Submitting a request with card details for withdrawal.",
                value={
                    "method": "card",
                    "card_number": "8600042393942601",
                },
                request_only=True
            ),
            OpenApiExample(
                'Example 2 - Bank Account Withdrawal (Savings)',
                description="Submitting a request with bank account details for withdrawal.",
                value={
                    "method": "bank",
                    "account_type": "savings",
                    "name_on_account": "Khusravbek Abdujalalov",
                    "account_number": "21039030393903",
                    "routing_number": "10010299202",
                    "bank_name": "BRB",
                },
                request_only=True
            ),
            OpenApiExample(
                'Example 3 - Bank Account Withdrawal (Debit)',
                description="Submitting a request with bank account details for withdrawal.",
                value={
                    "method": "bank",
                    "account_type": "debit",
                    "name_on_account": "Khusravbek Abdujalalov",
                    "account_number": "21039030393903",
                    "routing_number": "10010299202",
                    "bank_name": "BRB",
                },
                request_only=True
            )
        ]
    )
    def post(self, request, campaign_id):
        campaign = get_object_or_404(Campaign, id=campaign_id, creator=request.user.profile)
        serializer = WithdrawalRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if campaign.funding_status != 'successful':
            return Response({'detail': 'Campaign is not successful'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate withdrawal amount based on the raised amount and commission
        commission_amount = campaign.raised_amount * Decimal('0.05')
        withdrawal_amount = campaign.raised_amount - commission_amount

        if withdrawal_amount <= 0:
            return Response({'detail': 'Withdrawal amount is 0 or less'}, status=status.HTTP_400_BAD_REQUEST)

        if WithdrawalRequest.objects.filter(campaign=campaign).exists():
            return Response({'detail': 'Withdrawal request already exists'}, status=status.HTTP_400_BAD_REQUEST)

        withdrawal_request = WithdrawalRequest.objects.create(
            campaign=campaign,
            method=serializer.validated_data['method'],
            amount=withdrawal_amount,
            commission=commission_amount,
            card_number=serializer.validated_data.get('card_number'),
            account_type=serializer.validated_data.get('account_type'),
            name_on_account=serializer.validated_data.get('name_on_account'),
            account_number=serializer.validated_data.get('account_number'),
            routing_number=serializer.validated_data.get('routing_number'),
            bank_name=serializer.validated_data.get('bank_name'),
        )

        return Response(WithdrawalRequestSerializer(withdrawal_request).data, status=status.HTTP_201_CREATED)


class FounderCampaignSearchView(APIView):
    """
    API to search for campaigns based on title, excluding the user's own campaigns.
    """
    queryset = Campaign.objects.all()
    serializer_class = FounderCampaignSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Search campaigns for collaboration by their title, excluding the user's own campaigns. "
                    "Only approved campaigns and not yet successful ones will be shown.",
        parameters=[
            OpenApiParameter(name="search", type=str, location=OpenApiParameter.QUERY,
                             description="Search by campaign title")
        ],
        responses={200: FounderCampaignSerializer(many=True)}
    )
    def get(self, request):
        user_profile = request.user.profile

        search_query = request.query_params.get('search', '')

        # Filter campaigns: excluding own campaigns, approved, not successful
        campaigns = Campaign.objects.filter(
            Q(title__icontains=search_query) | Q(name__icontains=search_query),
            approval_status='approved',
        ).exclude(
            creator=user_profile
        ).exclude(
            funding_status='successful'
        )

        serializer = self.serializer_class(campaigns, many=True, context={'request': request})
        return Response(serializer.data)


class CampaignFundingStatusView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CampaignFundingStatusSerializer

    def get(self, request, campaign_id):
        try:
            campaign = Campaign.objects.get(id=campaign_id)
            if campaign.funding_status == 'successful':
                raised_amount = campaign.raised_amount
                commission_amount = raised_amount * 0.05
                withdrawal_amount = raised_amount - commission_amount

                data = {
                    'raised_amount': raised_amount,
                    'commission_amount': commission_amount,
                    'withdrawal_amount': withdrawal_amount
                }
                serializer = CampaignFundingStatusSerializer(data=data)
                if serializer.is_valid():
                    return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'detail': 'Campaign is not successful'}, status=status.HTTP_400_BAD_REQUEST)
        except Campaign.DoesNotExist:
            return Response({'detail': 'Campaign not found'}, status=status.HTTP_404_NOT_FOUND)


class CampaignApprovalStatusView(APIView):
    serializer_class = CampaignApprovalStatusSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, campaign_id):
        try:
            campaign = Campaign.objects.get(id=campaign_id)
            serializer = CampaignApprovalStatusSerializer(campaign)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Campaign.DoesNotExist:
            return Response({'error': 'Campaign not found'}, status=status.HTTP_404_NOT_FOUND)


class FounderCampaignNewsView(APIView):
    """
    API to post updates (news) for a campaign.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Post a new update for the specified campaign.",
        request=FounderCampaignNewsSerializer,
        responses={201: FounderCampaignNewsSerializer},
        parameters=[
            OpenApiParameter("campaign_id", type=int, location=OpenApiParameter.PATH,
                             description="Campaign ID to post the update for")
        ]
    )
    def post(self, request, campaign_id):
        # Get the campaign for which the user wants to post an update
        campaign = get_object_or_404(Campaign, id=campaign_id, creator=request.user.profile)

        # Serialize the incoming data
        serializer = FounderCampaignNewsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create the update (news) for the campaign
        campaign_news = CampaignNews.objects.create(
            campaign=campaign,
            title=serializer.validated_data['title'],
            content=serializer.validated_data['content']
        )

        self.notify_users(campaign, campaign_news)

        response_serializer = FounderCampaignNewsSerializer(campaign_news)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def notify_users(self, campaign, campaign_news):
        """
        Notify investors and savers about the new campaign update.
        """

        investors = UserProfile.objects.filter(investments__campaign=campaign).distinct()

        savers = UserProfile.objects.filter(saved_campaigns__campaign=campaign,
                                            saved_campaigns__is_active=True).distinct()

        # Notify investors
        for investor in investors:
            subject = "[Fundflow] New update posted for a campaign you've invested in"
            message = f"New update posted for a campaign you've invested in: {campaign.title or campaign.name}"

            Notification.objects.create(
                sender=campaign.creator,
                receiver=investor,
                notification_type='campaign_update',
                message=message,
                content_type=ContentType.objects.get_for_model(CampaignNews),
                object_id=campaign_news.id
            )

            try:
                send_notification_email(
                    subject=subject,
                    message=message,
                    recipient_list=[investor.email]
                )
            except Exception as e:
                print(f"Failed to send email notification to {investor.email}: {e}")

        for saver in savers:
            subject = "[Fundflow] New update posted for a campaign you've saved"
            message = f"New update posted for a campaign you've saved: {campaign.title or campaign.name}"

            Notification.objects.create(
                sender=campaign.creator,
                receiver=saver,
                notification_type='campaign_update',
                message=message,
                content_type=ContentType.objects.get_for_model(CampaignNews),
                object_id=campaign_news.id
            )

            try:
                send_notification_email(
                    subject=subject,
                    message=message,
                    recipient_list=[saver.email]
                )
            except Exception as e:
                print(f"Failed to send email notification to {saver.email}: {e}")


class CollaborationRequestView(APIView):
    """
    API for handling Collaboration Requests between campaigns.
    - Users can send collaboration requests to other campaigns
    - Users can view all collaboration requests sent to a campaign
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Retrieve all collaboration requests received by the specified campaign.",
        responses={200: CollaborationRequestSerializer(many=True)},
        parameters=[
            OpenApiParameter("campaign_id", type=int, location=OpenApiParameter.PATH,
                             description="Campaign ID for which to retrieve received collaboration requests")
        ]
    )
    def get(self, request, campaign_id):
        """
        Get all collaboration requests received by the current user's campaign
        """
        campaign = get_object_or_404(Campaign, id=campaign_id, creator=request.user.profile)
        collaboration_requests = CollaborationRequest.objects.filter(receiver_campaign=campaign)
        serializer = CollaborationRequestSerializer(collaboration_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        description="Create a collaboration request between campaigns.",
        request=CollaborationRequestCreateSerializer,
        responses={201: CollaborationRequestSerializer},
        parameters=[
            OpenApiParameter("campaign_id", type=int, location=OpenApiParameter.PATH,
                             description="Campaign ID of the sender's campaign")
        ]
    )
    def post(self, request, campaign_id):
        """
        Create a collaboration request between campaigns.
        """
        # Get the sender's campaign based on the campaign_id in the path
        sender_campaign = get_object_or_404(Campaign, id=campaign_id, creator=request.user.profile)
        sender = sender_campaign.creator  # Get the sender (creator of the sender campaign)

        # Validate the target campaign from the request body
        serializer = CollaborationRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Retrieve the target campaign
        target_campaign_id = serializer.validated_data['target_campaign_id']
        receiver_campaign = get_object_or_404(Campaign, id=target_campaign_id)
        receiver = receiver_campaign.creator  # Get the receiver (creator of the target campaign)

        # Check if the sender is trying to send a request to their own campaign
        if sender == receiver:
            return Response({"detail": "Cannot send a collaboration request to your own campaign."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if a collaboration request already exists
        if CollaborationRequest.objects.filter(sender_campaign=sender_campaign,
                                               receiver_campaign=receiver_campaign).exists():
            return Response({"detail": "Collaboration request already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # Create collaboration request
        collaboration_request = CollaborationRequest.objects.create(
            sender_campaign=sender_campaign,
            receiver_campaign=receiver_campaign,
            sender=sender,
            receiver=receiver
        )

        message = f"You have received a collaboration request for the campaign «{receiver_campaign.name}» from «{sender_campaign.title}»."
        subject = f"[Fundflow] New collaboration request for {receiver_campaign.name}"

        # Create a notification for the receiver about the collaboration request
        Notification.objects.create(
            sender=sender,
            receiver=receiver,
            notification_type='collaboration_request',
            message=f"You have received a collaboration request for the campaign «{receiver_campaign.name}» from «{sender_campaign.title}».",
            content_type=ContentType.objects.get_for_model(CollaborationRequest),
            object_id=collaboration_request.id
        )

        try:
            send_notification_email(
                subject=subject,
                message=message,
                recipient_list=[receiver.email]
            )
        except Exception as e:
            print(f"Failed to send email notification to {receiver.email}: {e}")

        response_serializer = CollaborationRequestSerializer(collaboration_request)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class CampaignPitchView(generics.RetrieveUpdateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignPitchSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        campaign_id = self.kwargs['campaign_id']
        try:
            campaign = Campaign.objects.get(id=campaign_id)
            return campaign
        except Campaign.DoesNotExist:
            raise NotFound('Campaign not found.')


class CampaignTeamMemberCreateView(generics.CreateAPIView):
    serializer_class = CampaignTeamMemberCreateSerializer
    permission_classes = [IsAuthenticated]
    queryset = CampaignTeamMember.objects.all()

    def perform_create(self, serializer):
        campaign_id = self.kwargs['campaign_id']
        campaign = Campaign.objects.get(id=campaign_id)
        serializer.save(campaign=campaign)


class CampaignTeamMemberListView(generics.ListAPIView):
    serializer_class = CampaignTeamMemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        campaign_id = self.kwargs['campaign_id']
        return CampaignTeamMember.objects.filter(campaign_id=campaign_id)


class CampaignLinkListView(generics.ListAPIView):
    serializer_class = CampaignLinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        campaign_id = self.kwargs['campaign_id']
        return CampaignLink.objects.filter(campaign_id=campaign_id)


class CampaignLinkCreateUpdateView(generics.CreateAPIView):
    queryset = CampaignLink.objects.all()
    serializer_class = CampaignLinkSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=CampaignLinkSerializer,
        responses={
            200: OpenApiResponse(description="Links created or updated successfully"),
            400: OpenApiResponse(description="Request data cannot be empty")
        },
        examples=[
            OpenApiExample(
                'List of objects',
                summary='List of objects',
                value=[
                    {
                        "platform": "telegram",
                        "link": "https://t.me/campaign"
                    },
                    {
                        "platform": "instagram",
                        "link": "https://instagram.com/campaign"
                    }
                ],
                request_only=True
            ),
            OpenApiExample(
                'Single object',
                summary='Single object',
                value={
                    "platform": "website",
                    "link": "https://campaign.com"
                },
                request_only=True
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        if not request.data:
            return Response({"error": "Request data cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        campaign_id = self.kwargs['campaign_id']
        campaign = Campaign.objects.get(id=campaign_id)
        links_data = request.data if isinstance(request.data, list) else [request.data]

        response_data = []
        for link_data in links_data:
            platform = link_data.get('platform')
            link = link_data.get('link')

            campaign_link, created = CampaignLink.objects.update_or_create(
                campaign=campaign,
                platform=platform,
                defaults={'link': link}
            )

            response_data.append({
                'status': 'created' if created else 'updated',
                'campaign_link': CampaignLinkSerializer(campaign_link).data
            })

        return Response(response_data, status=status.HTTP_200_OK)


class CampaignMediaCreateView(generics.CreateAPIView):
    queryset = CampaignMedia.objects.all()
    serializer_class = FounderCampaignMediaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        campaign_id = self.kwargs['id']
        campaign = Campaign.objects.get(id=campaign_id)
        serializer.save(campaign=campaign)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class FounderCampaignListView(ListAPIView):
    serializer_class = FounderCampaignListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user.profile
        return Campaign.objects.filter(creator=user)


class FounderCampaignDetailView(RetrieveAPIView):
    queryset = Campaign.objects.all()
    serializer_class = FounderCampaignDetailSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        # Set the response schema to the serializer directly
        responses=FounderCampaignDetailSerializer,
        # Define response examples using OpenApiExample
        examples=[
            OpenApiExample(
                'Get campaign details',
                summary='Get campaign details',
                value={
                    "id": 1,
                    "name": "Best camp",
                    "title": "Best camp",
                    "description": "Hi there",
                    "categories": [
                        {
                            "id": 1,
                            "name": "Tech"
                        }
                    ],
                    "tags": [
                        {
                            "id": 1,
                            "name": "tech"
                        }
                    ],
                    "media": {
                        "image": "http://127.0.0.1:8000/media/campaigns/campaign_media/1/y_fd0f3442.jpg",
                        "video": "https://www.youtube.com/watch?v=123456"
                    },
                    "project_state": "concept",
                    "location": "Tashkent",
                    "investment_type": "equity",
                    "goal_amount": "10000.00",
                    "raised_amount": "1000.00",
                    "min_investment": "100.00",
                    "max_goal_amount": "20000.00",
                    "funding_status": "live",
                    "approval_status": "approved",
                    "start_date": "2024-08-22",
                    "end_date": "2024-09-26"
                },
                response_only=True
            )
        ]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class CampaignEditView(generics.UpdateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignEditSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=CampaignEditSerializer,
        responses={
            200: OpenApiResponse(description="Campaign updated successfully",
                                 response=CampaignEditSuccessSerializer),
            400: OpenApiResponse(description="Validation error", response=ValidationErrorSerializer)
        },
        examples=[
            OpenApiExample(
                'Update multiple fields of a campaign',
                summary='Update all fields of a campaign',
                value={
                    "name": "New Campaign Name",
                    "title": "New Campaign Title",
                    "description": "New Campaign Description",
                    "categories": [1, 2],
                    "project_state": "concept",
                    "location": "Campaign Location",
                    "investment_type": "equity",
                    "goal_amount": 10000,
                    'tags': [1, 2],
                    "valuation_cap": 100000,
                    "min_investment": 100,
                    "max_goal_amount": 20000,
                    "start_date": "2022-01-01",
                    "end_date": "2022-12-31"
                },
                request_only=True
            ),
            OpenApiExample(
                'Update basic fields of a campaign',
                summary='Update basic fields of a campaign',
                value={
                    "name": "New Campaign Name",
                    "title": "New Campaign Title",
                    "description": "New Campaign Description",
                    "categories": [1, 2],
                    "project_state": "concept",
                    "location": "Campaign Location",
                },
                request_only=True
            ),
            OpenApiExample(
                'Update contract fields of a campaign',
                summary='Update contract fields of a campaign',
                value={
                    "investment_type": "equity",
                    "valuation_cap": 100000,
                    "min_investment": 100,
                },
                request_only=True
            ),
            OpenApiExample(
                'Update funding fields of a campaign',
                summary='Update funding fields of a campaign',
                value={
                    "goal_amount": 10000,
                    "max_goal_amount": 20000,
                },
                request_only=True
            ),
            OpenApiExample(
                'Update date fields of a campaign',
                summary='Update date fields of a campaign',
                value={
                    "start_date": "2022-01-01",
                    "end_date": "2022-12-31"
                },
                request_only=True
            ),
            OpenApiExample(
                'Update pitch of a campaign',
                summary='Update pitch of a campaign',
                value={
                    "pitch": "<h1>Updated Pitch</h1>",
                },
                request_only=True
            ),
        ]
    )
    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        modified_details = serializer.validated_data

        # Extract only the changed fields with their original values
        original_details = {field: getattr(instance, field) for field in modified_details}

        # Use AI moderation service
        moderation_service = ModerationService()
        moderation = moderation_service.moderate_changes(instance, original_details, modified_details)

        if moderation.action == 'requires_admin_review':
            self.perform_update(serializer)
            instance.approval_status = 'pending'
            instance.save()
            return Response({"message": "Campaign changes require admin review and have been set to pending approval.",
                             "action": moderation.action, "reason": moderation.reason},
                            status=status.HTTP_200_OK)
        elif moderation.action == 'does_not_require_admin_review':
            self.perform_update(serializer)
            return Response({"message": "Campaign updated successfully", "campaign_id": serializer.instance.id,
                             "action": moderation.action, "reason": moderation.reason},
                            status=status.HTTP_200_OK)
        elif moderation.action == 'block_changes':
            return Response({"error": moderation.reason, "action": moderation.action, "reason": moderation.reason},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            self.perform_update(serializer)
            instance.approval_status = 'pending'
            instance.save()
            return Response({"error": "Unknown moderation action."}, status=status.HTTP_400_BAD_REQUEST)


class CampaignRegistrationView(generics.CreateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignRegistrationSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=CampaignRegistrationSerializer,
        responses={
            201: OpenApiResponse(description="Campaign registered successfully",
                                 response=CampaignRegistrationSuccessSerializer),
            400: OpenApiResponse(description="Validation error", response=ValidationErrorSerializer)
        },
        examples=[
            OpenApiExample(
                'Register new campaign with 2 categories',
                summary='Register a campaign with 2 categories',
                value={
                    "name": "Campaign Name",
                    "description": "Campaign Description",
                    "categories": [1, 2],
                    "project_state": "concept",
                    "location": "Campaign Location",
                    "investment_type": "equity",
                    "goal_amount": 10000,
                    "extra_info": "Extra Info"
                },
                request_only=True
            ),
            OpenApiExample(
                'Register new campaign with 1 category',
                summary='Register a campaign with 1 category',
                value={
                    "name": "Campaign Name",
                    "description": "Campaign Description",
                    "categories": [1],
                    "project_state": "concept",
                    "location": "Campaign Location",
                    "investment_type": "equity",
                    "goal_amount": 10000,
                    "extra_info": "Extra Info",
                },
                request_only=True
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Generate tags for the campaign
        campaign_details = serializer.validated_data
        tag_service = TagGenerationService()

        tags = tag_service.generate_tags(campaign_details)

        # Add generated tags to the campaign details
        tags_ids = []
        for tag in tags.tags:
            tag_object = CampaignTag.objects.get_or_create(name=tag)  # create tag if not exists
            tags_ids.append(tag_object[0].id)

        campaign_details['tags'] = tags_ids

        self.perform_create(serializer)
        return Response({"message": "Campaign registered successfully", "campaign_id": serializer.instance.id},
                        status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user.profile)


class CampaignInvestmentView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CampaignInvestmentSerializer

    def get(self, request, campaign_id):
        campaign = Campaign.objects.get(pk=campaign_id)
        serializer = CampaignInvestmentSerializer(campaign, context={'request': request})
        return Response(serializer.data)


class CampaignSaveView(generics.GenericAPIView):
    queryset = UserSavedCampaign.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, campaign_id):
        user = request.user.profile
        campaign = Campaign.objects.get(id=campaign_id)

        saved_campaign, created = UserSavedCampaign.objects.get_or_create(
            user=user,
            campaign=campaign
        )

        if not created and saved_campaign.is_active:
            # Unsave the campaign
            saved_campaign.is_active = False
            message = "Campaign unsaved."
        else:
            # Save the campaign
            saved_campaign.is_active = True
            message = "Campaign saved."

        saved_campaign.save()

        return Response({"message": message}, status=status.HTTP_200_OK)


class CampaignLikeView(generics.GenericAPIView):
    queryset = CampaignLike.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, campaign_id):
        user = request.user.profile
        campaign = Campaign.objects.get(id=campaign_id)

        like, created = CampaignLike.objects.get_or_create(
            user=user,
            campaign=campaign
        )

        if not created and like.is_active:
            # Unlike the campaign
            like.is_active = False
            message = "Campaign unliked."
        else:
            # Like the campaign
            like.is_active = True
            message = "Campaign liked."

        like.save()

        return Response({"message": message}, status=status.HTTP_200_OK)


class CampaignShareView(generics.GenericAPIView):
    queryset = CampaignShare.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, campaign_id):
        user = request.user.profile
        campaign = Campaign.objects.get(id=campaign_id)

        CampaignShare.objects.create(
            user=user,
            campaign=campaign
        )

        return Response({"message": "Campaign shared."}, status=status.HTTP_200_OK)


class CampaignFAQListView(generics.ListAPIView):
    serializer_class = CampaignFAQSerializer

    def get_queryset(self):
        campaign_id = self.kwargs['campaign_id']
        return CampaignFAQ.objects.filter(campaign__id=campaign_id).order_by('order')


class CampaignNewsListView(generics.ListAPIView):
    serializer_class = CampaignNewsSerializer

    def get_queryset(self):
        campaign_id = self.kwargs.get('campaign_id')
        return CampaignNews.objects.filter(campaign_id=campaign_id).order_by('-created_at')


class CampaignNewsDetailView(generics.RetrieveAPIView):
    queryset = CampaignNews.objects.all()
    serializer_class = CampaignNewsDetailSerializer
    lookup_field = 'id'


class CampaignDetailView(RetrieveAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Add campaign visit
        user = request.user.profile
        CampaignVisit.objects.create(user=user, campaign=instance)

        # Serialize the campaign details
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CampaignDetailByNameView(RetrieveAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignDetailSerializer
    lookup_field = 'name'
    permission_classes = [AllowAny]

    def get_object(self):
        name = self.kwargs.get('name')
        return Campaign.objects.get(name=name)


class CampaignCategoryListView(generics.ListAPIView):
    queryset = CampaignCategory.objects.all()
    serializer_class = CampaignCategorySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        others_category = queryset.filter(name='Others')
        queryset = queryset.exclude(name='Others')
        return list(queryset) + list(others_category)


class CampaignTagListView(generics.ListAPIView):
    queryset = CampaignTag.objects.all()
    serializer_class = CampaignTagSerializer


class CampaignVisitView(generics.CreateAPIView):
    queryset = CampaignVisit.objects.all()
    serializer_class = CampaignVisitSerializer


class CampaignRatingView(generics.CreateAPIView):
    queryset = CampaignRating.objects.all()
    serializer_class = CampaignRatingSerializer


class LastVisitedCampaignsView(generics.ListAPIView):
    serializer_class = LastVisitedCampaignSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the UserProfile instance for the authenticated user
        user_profile = self.request.user.profile

        # Subquery to get the latest visit per campaign for the user
        latest_visits = CampaignVisit.objects.filter(user=user_profile).values('campaign').annotate(
            latest_visit=Max('visited_at')
        ).values('campaign', 'latest_visit')

        # Use the subquery to filter the CampaignVisit records
        return CampaignVisit.objects.filter(
            user=user_profile,
            visited_at__in=[visit['latest_visit'] for visit in latest_visits]
        ).order_by('-visited_at')


class ClosingSoonCampaignsView(generics.ListAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [
        IsAuthenticated]

    def get_queryset(self):
        # Get today's date
        today = timezone.now().date()

        # Calculate the date 10 days from now
        soon_date = today + timedelta(days=10)

        # Filter campaigns with end_date between today and soon_date, and order by least days remaining first
        return Campaign.objects.filter(
            end_date__gte=today,
            end_date__lte=soon_date
        ).order_by('end_date')


class CampaignFilter(filters.FilterSet):
    # Goal Amount in USD (Choices)
    goal_amount = filters.ChoiceFilter(
        field_name='goal_amount',
        choices=[
            ('lt_1000', '<1000'),
            ('btw_1000_10000', '1000-10,000'),
            ('btw_10000_50000', '10,000-50,000'),
            ('gt_50000', '>50,000')
        ],
        method='filter_goal_amount'
    )

    # Funding Status Filter
    funding_status = filters.MultipleChoiceFilter(choices=Campaign.FUNDING_STATUS_CHOICES)

    # Project State Filter
    project_state = filters.MultipleChoiceFilter(choices=Campaign.PROJECT_STATE_CHOICES)

    # Raised Percentage Filter
    raised_percentage = filters.ChoiceFilter(
        method='filter_raised_percentage',
        choices=[
            ('lt_75', '< 75%'),
            ('btw_75_100', '75% - 100%'),
            ('gt_100', '> 100%')
        ]
    )

    class Meta:
        model = Campaign
        fields = ['goal_amount', 'funding_status', 'project_state']

    def filter_goal_amount(self, queryset, name, value):
        if value == 'lt_1000':
            return queryset.filter(goal_amount__lt=1000)
        elif value == 'btw_1000_10000':
            return queryset.filter(goal_amount__gte=1000, goal_amount__lte=10000)
        elif value == 'btw_10000_50000':
            return queryset.filter(goal_amount__gte=10000, goal_amount__lte=50000)
        elif value == 'gt_50000':
            return queryset.filter(goal_amount__gt=50000)
        return queryset

    def filter_raised_percentage(self, queryset, name, value):
        if value == 'lt_75':
            return queryset.filter(raised_amount__lt=F('goal_amount') * 0.75)
        elif value == 'btw_75_100':
            return queryset.filter(raised_amount__gte=F('goal_amount') * 0.75, raised_amount__lte=F('goal_amount'))
        elif value == 'gt_100':
            return queryset.filter(raised_amount__gt=F('goal_amount'))
        return queryset


class CampaignListView(generics.ListAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    filter_backends = [filters.DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CampaignFilter
    search_fields = ['title', 'description', 'tags__name', 'categories__name', 'creator__name', 'location']
    ordering_fields = ['created_at', 'end_date', 'raised_amount']

    def get_queryset(self):
        queryset = super().get_queryset()

        queryset = queryset.filter(funding_status='live', approval_status='approved')

        # Sort by "Most Funded"
        if self.request.query_params.get('sort') == 'most_funded':
            queryset = queryset.order_by('-raised_amount')

        # Sort by "End Date"
        elif self.request.query_params.get('sort') == 'end_date':
            queryset = queryset.order_by('end_date')

        # Sort by "Newest"
        elif self.request.query_params.get('sort') == 'newest':
            queryset = queryset.order_by('-created_at')

        # Sort by "Most backed" (Most people invested)
        elif self.request.query_params.get('sort') == 'most_backed':
            queryset = queryset.annotate(num_investors=Count('investments')).order_by('-num_investors')

        # Sort by "Most popular" (Most visited)
        elif self.request.query_params.get('sort') == 'most_popular':
            queryset = queryset.annotate(num_visits=Count('visits')).order_by('-num_visits')

        # Default sort by "Most liked"
        else:
            queryset = queryset.annotate(num_likes=Count('likes')).order_by('-num_likes')

        return queryset


class RecommendedCampaignsForCollaborationView(APIView):
    """
    API to recommend collaborations using AI
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: RecommendedCampaignSerializer(many=True)},
        description="Recommends potential collaborations based on project details"
    )
    def get(self, request, campaign_id):
        current_campaign = Campaign.objects.get(id=campaign_id)
        current_campaign_details = {
            "name": current_campaign.name,
            "title": current_campaign.title,
            "description": current_campaign.description,
            "categories": current_campaign.categories.all(),
            "tags": current_campaign.tags.all(),
            "location": current_campaign.location,
        }

        campaigns = Campaign.objects.exclude(creator=current_campaign.creator).exclude(
            funding_status='successful').filter(approval_status='approved').order_by('-created_at')[:20]

        recommended_campaigns_list = []
        collaboration_service = CollaborationRecommendationService()
        match_count = 0

        for campaign in campaigns:
            if match_count >= 4:
                break

            campaign_details = {
                "name": campaign.name,
                "title": campaign.title,
                "description": campaign.description,
                "categories": campaign.categories.all(),
                "tags": campaign.tags.all(),
                "location": campaign.location,
            }

            recommendation = collaboration_service.recommend_collaboration(current_campaign_details, campaign_details)
            if recommendation.verdict == 'yes':
                campaign.matching_percentage = recommendation.matching_percentage
                campaign.collaboration_reason = recommendation.reason
                recommended_campaigns_list.append(campaign)
                match_count += 1

        recommended_campaigns_list.sort(key=lambda x: x.matching_percentage, reverse=True)
        serializer = RecommendedCampaignSerializer(recommended_campaigns_list, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


# recommended category
class SimpleCategoryRecommendationView(APIView):
    """
    API to recommend a category for a campaign using AI
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=SimpleCategoryRecommendationRequestSerializer,
        responses={200: CategoryRecommendationSerializer,
                   400: OpenApiResponse(description="Not enough information to recommend a category")},
        description="Recommends a category based on campaign details from available categories."
    )
    def post(self, request):
        data = request.data
        name = data.get("name")
        title = data.get("title")
        description = data.get("description")

        if (not name and not title) or not description:
            return Response({"error": "Name, title, and description are required."}, status=status.HTTP_400_BAD_REQUEST)

        campaign_details = {
            "name": name or title,
            "title": title or name,
            "description": description
        }

        category_service = CategoryRecommendationService()
        recommended_category = category_service.recommend_category(campaign_details)
        if recommended_category.not_enough_info or recommended_category.category == "not_enough_info":
            return Response({"error": "Not enough information to recommend a category."},
                            status=status.HTTP_400_BAD_REQUEST)
        category_dict = {
            "category": recommended_category.category
        }
        return Response(category_dict, status=status.HTTP_200_OK)

# # merged with RecommendedCampaignsForCollaborationView
# class SimpleCollaborationRecommendationView(APIView):
#     """
#     API to recommend collaborations using AI
#     """
#     permission_classes = [IsAuthenticated]
#
#     @extend_schema(
#         responses={200: RecommendedCampaignSerializer(many=True)},
#         description="Recommends potential collaborations based on project details"
#     )
#     def get(self, request, campaign_id):
#         current_campaign = Campaign.objects.get(id=campaign_id)
#         current_campaign_details = {
#             "name": current_campaign.name,
#             "title": current_campaign.title,
#             "description": current_campaign.description,
#             "categories": current_campaign.categories.all(),
#             "tags": current_campaign.tags.all(),
#             "location": current_campaign.location,
#         }
#
#         campaigns = Campaign.objects.exclude(creator=current_campaign.creator).exclude(
#             funding_status='successful').filter(approval_status='approved').order_by('-created_at')[:20]
#
#         recommended_campaigns_list = []
#         collaboration_service = CollaborationRecommendationService()
#         match_count = 0
#
#         for campaign in campaigns:
#             if match_count >= 4:
#                 break
#
#             campaign_details = {
#                 "name": campaign.name,
#                 "title": campaign.title,
#                 "description": campaign.description,
#                 "categories": campaign.categories.all(),
#                 "tags": campaign.tags.all(),
#                 "location": campaign.location,
#             }
#
#             recommendation = collaboration_service.recommend_collaboration(current_campaign_details, campaign_details)
#             if recommendation.verdict == 'yes':
#                 campaign.matching_percentage = recommendation.matching_percentage
#                 campaign.collaboration_reason = recommendation.reason
#                 recommended_campaigns_list.append(campaign)
#                 match_count += 1
#
#         recommended_campaigns_list.sort(key=lambda x: x.matching_percentage, reverse=True)
#         serializer = RecommendedCampaignSerializer(recommended_campaigns_list, many=True, context={'request': request})
#         return Response(serializer.data, status=status.HTTP_200_OK)
