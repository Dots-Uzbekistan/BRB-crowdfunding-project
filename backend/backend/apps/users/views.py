from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import UserProfile, UserSavedCampaign
from .serializers import UserProfileSerializer, SavedCampaignSerializer, UpdateUserProfileSerializer


class SavedCampaignsView(APIView):
    serializer_class = SavedCampaignSerializer

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = self.request.user.userprofile

        # Get saved campaigns for the user, ordered by saved_at
        saved_campaigns = UserSavedCampaign.objects.filter(user=user_profile).order_by('-last_saved_at')

        # Serialize the saved campaigns data
        serializer = SavedCampaignSerializer(saved_campaigns, many=True, context={'request': request})
        return Response(serializer.data)


class UpdateUserProfileView(generics.UpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UpdateUserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.userprofile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Allow partial updates by default
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


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
