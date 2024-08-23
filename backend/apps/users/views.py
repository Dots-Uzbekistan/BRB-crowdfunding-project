from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import UserProfile
from .serializers import UserProfileSerializer


class CreateUserProfileView(generics.CreateAPIView):
	queryset = UserProfile.objects.all()
	serializer_class = UserProfileSerializer
	permission_classes = [IsAuthenticated]

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class UserProfileRetrieveView(generics.RetrieveAPIView):
	queryset = UserProfile.objects.all()
	serializer_class = UserProfileSerializer
	permission_classes = [IsAuthenticated]
	authentication_classes = [JWTAuthentication]

	def get_object(self):
		return self.request.user.userprofile
