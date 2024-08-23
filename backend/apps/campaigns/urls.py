from django.urls import path

from .views import CampaignListView, CampaignCategoryListView, CampaignTagListView, CampaignVisitView, \
	CampaignRatingView, LastVisitedCampaignsView, ClosingSoonCampaignsView

urlpatterns = [
	path('campaigns/', CampaignListView.as_view(), name='campaign-list'),
	path('categories/', CampaignCategoryListView.as_view(), name='category-list'),
	path('tags/', CampaignTagListView.as_view(), name='tag-list'),

	path('campaigns/last-visited/', LastVisitedCampaignsView.as_view(), name='last-visited-campaigns'),
	path('campaigns/closing-soon/', ClosingSoonCampaignsView.as_view(), name='closing-soon-campaigns'),

	path('campaigns/<int:pk>/visit/', CampaignVisitView.as_view(), name='campaign-visit'),
	path('campaigns/<int:pk>/rate/', CampaignRatingView.as_view(), name='campaign-rate'),
]
