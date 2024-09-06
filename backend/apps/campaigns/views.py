from datetime import timedelta

from django.db.models import Max, F
from django.utils import timezone
from django_filters import rest_framework as filters
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from rest_framework import status, generics
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CampaignCategory, CampaignTag, CampaignRating, CampaignVisit, CampaignNews, CampaignFAQ, \
    CampaignLike, CampaignMedia, CampaignLink, CampaignTeamMember, Campaign
from .serializers import CampaignCategorySerializer, CampaignTagSerializer, CampaignVisitSerializer, \
    CampaignRatingSerializer, LastVisitedCampaignSerializer, CampaignSerializer, CampaignDetailSerializer, \
    CampaignNewsSerializer, CampaignNewsDetailSerializer, CampaignFAQSerializer, CampaignInvestmentSerializer, \
    CampaignRegistrationSerializer, CampaignRegistrationSuccessSerializer, ValidationErrorSerializer, \
    CampaignEditSerializer, CampaignEditSuccessSerializer, FounderCampaignDetailSerializer, \
    FounderCampaignListSerializer, FounderCampaignMediaSerializer, CampaignLinkSerializer, CampaignTeamMemberSerializer, \
    CampaignTeamMemberCreateSerializer
from ..users.models import UserSavedCampaign


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
        ]
    )
    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Campaign updated successfully", "campaign_id": serializer.instance.id},
                        status=status.HTTP_200_OK)


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

        # todo: finish the following sorts
        # Sort by "Most backed"
        # keep fake for now
        elif self.request.query_params.get('sort') == 'most_backed':
            queryset = queryset.order_by('-raised_amount')

        # Sort by "Most popular"
        # keep fake for now
        elif self.request.query_params.get('sort') == 'most_popular':
            queryset = queryset.order_by('-raised_amount')

        return queryset
