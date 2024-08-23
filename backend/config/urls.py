from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from config import settings

urlpatterns = [
    path('admin/', admin.site.urls),

	path('api/auth/', include('apps.authentication.urls')),

    path('api/users/', include('apps.users.urls')),

    path('api/catalog/', include('apps.campaigns.urls')),

	path('api/investments/', include('apps.investments.urls')),

	path('api/notifications/', include('apps.notifications.urls')),

	path('api-auth/', include('rest_framework.urls')),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
