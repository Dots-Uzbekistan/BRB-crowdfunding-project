from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer


class UserNotificationsListView(ListAPIView):
    """
    API to retrieve the list of notifications for the current authenticated user.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Get the list of notifications for the current user.",
        responses={200: NotificationSerializer(many=True)},
    )
    def get(self, request):
        notifications = Notification.objects.filter(receiver=request.user.profile).order_by('-created_at')

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
