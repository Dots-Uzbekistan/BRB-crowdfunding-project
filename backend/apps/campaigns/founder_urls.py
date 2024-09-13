from django.urls import path

from .views import CampaignRegistrationView, CampaignEditView, FounderCampaignDetailView, FounderCampaignListView, \
    CampaignMediaCreateView, CampaignLinkCreateUpdateView, CampaignLinkListView, CampaignTeamMemberListView, \
    CampaignTeamMemberCreateView, CampaignPitchView, RecommendedCampaignsForCollaborationView, CollaborationRequestView, \
    FounderCampaignNewsView, CampaignApprovalStatusView, CampaignFundingStatusView, FounderCampaignSearchView, \
    WithdrawalRequestView, CampaignCreationStatsView, FounderDashboardStatsView, SimpleCategoryRecommendationView

urlpatterns = [
    path('campaigns/register/', CampaignRegistrationView.as_view(), name='campaign-register'),
    path('campaigns/creation-stats/', CampaignCreationStatsView.as_view(), name='campaign-creation-stats'),
    path('campaigns/', FounderCampaignListView.as_view(), name='founder-campaign-list'),
    path('campaigns/<int:pk>/', FounderCampaignDetailView.as_view(), name='campaign-founder-detail'),
    path('campaigns/<int:pk>/edit/', CampaignEditView.as_view(), name='campaign-edit'),
    path('campaigns/<int:pk>/add-media/', CampaignMediaCreateView.as_view(), name='campaign-add-media'),
    path('campaigns/<int:campaign_id>/links/', CampaignLinkCreateUpdateView.as_view(),
         name='campaign-link-update-create'),
    path('campaigns/<int:campaign_id>/links/list/', CampaignLinkListView.as_view(), name='campaign-link-list'),

    path('campaigns/<int:campaign_id>/team/', CampaignTeamMemberListView.as_view(), name='campaign-team-members'),
    path('campaigns/<int:campaign_id>/team/add/', CampaignTeamMemberCreateView.as_view(),
         name='campaign-team-member-add'),
    path('campaigns/<int:campaign_id>/pitch/', CampaignPitchView.as_view(), name='campaign-pitch'),

    path('campaigns/<int:campaign_id>/recommended-campaigns/', RecommendedCampaignsForCollaborationView.as_view(),
         name='recommended-campaigns'),

    path('campaigns/recommend-category/', SimpleCategoryRecommendationView.as_view(), name='recommend-category'),

    path('campaigns/<int:campaign_id>/collaboration-request/', CollaborationRequestView.as_view(),
         name='collaboration-request'),

    path('campaigns/<int:campaign_id>/updates/', FounderCampaignNewsView.as_view(), name='campaign-news-create'),

    path('campaigns/<int:campaign_id>/approval-status/', CampaignApprovalStatusView.as_view(),
         name='campaign-approval-status'),

    path('campaigns/<int:campaign_id>/funding-status/', CampaignFundingStatusView.as_view(),
         name='campaign-funding-status'),

    path('collaboration/search-campaigns/', FounderCampaignSearchView.as_view(), name='collaboration-search-campaigns'),

    path('campaigns/<int:campaign_id>/withdrawal-request/', WithdrawalRequestView.as_view(), name='withdrawal-request'),

    path('campaigns/<int:campaign_id>/dashboard-stats/', FounderDashboardStatsView.as_view(),
         name='founder-dashboard-stats'),
]
