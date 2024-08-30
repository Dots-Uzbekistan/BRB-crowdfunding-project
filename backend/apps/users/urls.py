from django.urls import path

from .views import CreateUserProfileView, UserProfileRetrieveView, SavedCampaignsView, UpdateUserProfileView

urlpatterns = [
    path('create-profile/', CreateUserProfileView.as_view(), name='create-user-profile'),
    path('profile/', UserProfileRetrieveView.as_view(), name='user-profile'),
    path('update-profile/', UpdateUserProfileView.as_view(), name='update-user-profile'),
    path('saved-campaigns/', SavedCampaignsView.as_view(), name='saved-campaigns'),
]
