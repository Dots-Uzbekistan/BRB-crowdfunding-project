from django.urls import path

from .views import CreateUserProfileView, UserProfileRetrieveView

urlpatterns = [
	path('create-profile/', CreateUserProfileView.as_view(), name='create-user-profile'),
	path('profile/', UserProfileRetrieveView.as_view(), name='user-profile'),
]
