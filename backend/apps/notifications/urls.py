from django.urls import path

from apps.notifications.views import UserNotificationsListView

urlpatterns = [
    path('', UserNotificationsListView.as_view(), name='user-notifications'),
]
