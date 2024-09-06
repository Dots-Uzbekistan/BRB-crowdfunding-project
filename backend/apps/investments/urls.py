from django.urls import path

from apps.investments.views import InvestmentsEndingSoonView, InvestmentCategoryBreakdownView, CampaignViewsRateView, \
    Last30DaysInvestmentView, UserInvestedCampaignNewsView, TransactionHistoryView, CreateInvestmentView

urlpatterns = [
    path('dashboard/ending-soon/', InvestmentsEndingSoonView.as_view(), name='investments-ending-soon'),
    path('dashboard/category-breakdown/', InvestmentCategoryBreakdownView.as_view(),
         name='investment-category-breakdown'),
    path('dashboard/views-rate/', CampaignViewsRateView.as_view(), name='investment-views-rate'),
    path('dashboard/last-30-days/', Last30DaysInvestmentView.as_view(), name='last-30-days-investment'),
    path('dashboard/updates/', UserInvestedCampaignNewsView.as_view(), name='user-invested-campaign-news'),
    path('dashboard/history/', TransactionHistoryView.as_view(), name='transaction-history'),

    path('create-investment/', CreateInvestmentView.as_view(), name='create-investment'),
]
