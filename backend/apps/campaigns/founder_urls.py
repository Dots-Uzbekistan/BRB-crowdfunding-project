from django.urls import path

from .views import CampaignRegistrationView, CampaignEditView, FounderCampaignDetailView, FounderCampaignListView, \
    CampaignMediaCreateView, CampaignLinkCreateUpdateView, CampaignLinkListView, CampaignTeamMemberListView, \
    CampaignTeamMemberCreateView

urlpatterns = [
    path('campaigns/register/', CampaignRegistrationView.as_view(), name='campaign-register'),
    # edit campaign
    path('campaigns/', FounderCampaignListView.as_view(), name='founder-campaign-list'),
    path('campaigns/<int:pk>/', FounderCampaignDetailView.as_view(), name='campaign-founder-detail'),
    path('campaigns/<int:pk>/edit/', CampaignEditView.as_view(), name='campaign-edit'),
    path('campaigns/<int:pk>/add-media/', CampaignMediaCreateView.as_view(), name='campaign-add-media'),
    path('campaigns/<int:campaign_id>/links/', CampaignLinkCreateUpdateView.as_view(), name='campaign-link-update-create'),
    path('campaigns/<int:campaign_id>/links/list/', CampaignLinkListView.as_view(), name='campaign-link-list'),

    path('campaigns/<int:campaign_id>/team/', CampaignTeamMemberListView.as_view(), name='campaign-team-members'),
    path('campaigns/<int:campaign_id>/team/add/', CampaignTeamMemberCreateView.as_view(), name='campaign-team-member-add'),
]
