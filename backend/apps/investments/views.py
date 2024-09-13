from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Investment, Transaction, Payment
from .serializers import TransactionSerializer, PaymentSerializer, UserInvestmentSerializer, InvestmentSerializer, \
    TransactionHistorySerializer, CampaignViewsRateSerializer, Last30DaysInvestmentSerializer, \
    InvestmentCreateSerializer, UserInvestedCampaignNewsSerializer, InvestmentCategoryBreakdownSerializer
from ..campaigns.models import Campaign, CampaignCategory, CampaignVisit, CampaignNews


class CreateInvestmentView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            result = serializer.save()
            return Response({
                "payment_link": result["payment_link"],
                "investment_id": result["investment"].id,
                "transaction_id": result["transaction"].id,
                "payment_id": result["payment"].id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionHistorySerializer

    def get(self, request):
        user = request.user.profile

        # Get transactions for the user's investments
        transactions = (
            Transaction.objects.filter(investment__user=user, status='successful').order_by('-transaction_date'))

        # Serialize the transactions data and pass the request context
        serializer = self.serializer_class(transactions, many=True, context={'request': request})
        return Response(serializer.data)


class UserInvestedCampaignNewsView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserInvestedCampaignNewsSerializer

    def get(self, request):
        user = request.user.profile

        # Get campaigns the user has invested in
        invested_campaigns = Investment.objects.filter(user=user, status='successful').values_list('campaign',
                                                                                                   flat=True)

        # Get news related to those campaigns
        news = CampaignNews.objects.filter(campaign__in=invested_campaigns).order_by('-created_at')

        # Serialize the news data and pass the request context
        serializer = self.serializer_class(news, many=True, context={'request': request})
        return Response(serializer.data)


class Last30DaysInvestmentView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Last30DaysInvestmentSerializer

    def get(self, request):
        user = request.user.profile
        today = timezone.now().date()
        last_30_days = today - timezone.timedelta(days=30)

        # Sum the total investment amount in the last 30 days
        total_investment = Investment.objects.filter(user=user, investment_date__gte=last_30_days, status='successful') \
                               .aggregate(total=Sum('amount'))['total'] or 0

        # Prepare the response
        data = {
            'total_invested': f"${total_investment:,.0f}"
        }

        return Response(data)


class CampaignViewsRateView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CampaignViewsRateSerializer

    def get(self, request):
        user = request.user.profile

        # Get campaigns the user has invested in
        invested_campaigns = Investment.objects.filter(user=user, status='successful').values_list('campaign',
                                                                                                   flat=True)

        # Aggregate views by month for these campaigns
        campaign_views = CampaignVisit.objects.filter(campaign__in=invested_campaigns) \
            .annotate(month=TruncMonth('visited_at')) \
            .values('campaign__title', 'month') \
            .annotate(total_views=Count('id')) \
            .order_by('month')

        # Prepare the data
        campaign_data = {}
        for item in campaign_views:
            campaign_name = item['campaign__title']
            month = item['month'].strftime('%b')
            total_views = item['total_views']

            if campaign_name not in campaign_data:
                campaign_data[campaign_name] = {
                    'monthly_views': {},
                    'max_views': 0,
                }

            # Store views for the month
            campaign_data[campaign_name]['monthly_views'][month] = total_views
            campaign_data[campaign_name]['max_views'] = max(campaign_data[campaign_name]['max_views'], total_views)

        # Convert the campaign data to a list of dictionaries
        response_data = [
            {
                'campaign_name': name,
                'monthly_views': data['monthly_views'],
                'max_views': data['max_views']
            } for name, data in campaign_data.items()
        ]

        return Response(response_data)


class InvestmentCategoryBreakdownView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentCategoryBreakdownSerializer

    def get(self, request):
        user = request.user.profile

        # Get all categories associated with campaigns the user has invested in
        invested_campaigns = Investment.objects.filter(user=user, status='successful').values_list('campaign',
                                                                                                   flat=True)
        categories = CampaignCategory.objects.filter(campaign__in=invested_campaigns).distinct()

        # Serialize the categories and calculate percentages
        serializer = InvestmentCategoryBreakdownSerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)


class InvestmentsEndingSoonView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserInvestmentSerializer

    def get(self, request):
        user = request.user.profile
        today = timezone.now().date()

        # Aggregate total investment per campaign
        investments = Investment.objects.filter(user=user, campaign__end_date__gte=today) \
            .values('campaign') \
            .annotate(total_invested=Sum('amount')) \
            .filter(campaign__investment_type='equity', status='successful') \
            .order_by('campaign__end_date')

        # We fetch the related campaigns for these investments
        campaigns = Campaign.objects.filter(id__in=[inv['campaign'] for inv in investments])

        # Prepare a dictionary to map campaign_id to total_invested
        campaign_investment_map = {inv['campaign']: inv['total_invested'] for inv in investments}

        # Serialize the campaigns with the total invested amount
        serializer = UserInvestmentSerializer(campaigns, many=True, context={'request': request,
                                                                             'campaign_investment_map': campaign_investment_map})
        return Response(serializer.data)


class InvestmentViewSet(viewsets.ModelViewSet):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
