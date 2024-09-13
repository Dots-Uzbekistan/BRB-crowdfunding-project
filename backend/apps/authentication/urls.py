from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.authentication.views import CreateUserView, CustomLoginView, PasswordChangeView

urlpatterns = [
	path('register/', CreateUserView.as_view(), name='register'),
	path('login/', CustomLoginView.as_view(), name='login'),
	path('token/', TokenObtainPairView.as_view(), name='get_token'),
	path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
	path('change-password/', PasswordChangeView.as_view(), name='change-password'),
	# path('/userinfo/', AuthUserProfileDetailView.as_view(), name='auth_user_profile'),
]
