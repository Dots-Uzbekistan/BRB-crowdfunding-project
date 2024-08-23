from datetime import timedelta

from django.db.models import Max, F
from django.utils import timezone
from django_filters import rest_framework as filters
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated

from .models import CampaignCategory, CampaignTag, CampaignRating, CampaignVisit, Campaign
from .serializers import CampaignCategorySerializer, CampaignTagSerializer, CampaignVisitSerializer, \
	CampaignRatingSerializer, LastVisitedCampaignSerializer, CampaignSerializer


class CampaignCategoryListView(generics.ListAPIView):
	queryset = CampaignCategory.objects.all()
	serializer_class = CampaignCategorySerializer


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
		user_profile = self.request.user.userprofile

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
	search_fields = ['title', 'description']
	ordering_fields = ['created_at', 'end_date', 'raised_amount']

	def get_queryset(self):
		queryset = super().get_queryset()

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
