from django.urls import path

from .views import CampaignListView, CampaignCategoryListView, CampaignTagListView, CampaignVisitView, \
    CampaignRatingView, LastVisitedCampaignsView, ClosingSoonCampaignsView, CampaignDetailView, CampaignNewsListView, \
    CampaignNewsDetailView, CampaignFAQListView, CampaignSaveView, CampaignLikeView, CampaignInvestmentView, \
    CampaignRegistrationView

urlpatterns = [
    path('campaigns/', CampaignListView.as_view(), name='campaign-list'),
    path('categories/', CampaignCategoryListView.as_view(), name='category-list'),
    path('tags/', CampaignTagListView.as_view(), name='tag-list'),

    path('campaigns/last-visited/', LastVisitedCampaignsView.as_view(), name='last-visited-campaigns'),
    path('campaigns/closing-soon/', ClosingSoonCampaignsView.as_view(), name='closing-soon-campaigns'),

    path('campaigns/<int:pk>/visit/', CampaignVisitView.as_view(), name='campaign-visit'),
    path('campaigns/<int:pk>/rate/', CampaignRatingView.as_view(), name='campaign-rate'),

    path('campaigns/<int:pk>/', CampaignDetailView.as_view(), name='campaign-detail'),

    path('campaigns/<int:campaign_id>/updates/', CampaignNewsListView.as_view(), name='campaign-news-list'),
    path('updates/<int:id>/', CampaignNewsDetailView.as_view(), name='campaign-news-detail'),

    path('campaigns/<int:campaign_id>/faqs/', CampaignFAQListView.as_view(), name='campaign-faqs'),

    path('campaigns/<int:campaign_id>/like/', CampaignLikeView.as_view(), name='campaign-like'),

    path('campaigns/<int:campaign_id>/save/', CampaignSaveView.as_view(), name='campaign-save'),

    path('campaigns/<int:campaign_id>/invest/', CampaignInvestmentView.as_view(), name='campaign-invest'),
]
