from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.investments.views import InvestmentViewSet, TransactionViewSet, PaymentViewSet
from apps.notifications.views import NotificationViewSet

router = DefaultRouter()
router.register(r'investments', InvestmentViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]