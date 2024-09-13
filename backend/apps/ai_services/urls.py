from django.urls import path

from .views import TagGenerationView, CategoryRecommendationView, CollaborationRecommendationView, ModerationView

urlpatterns = [
    path('generate-tags/', TagGenerationView.as_view(), name='generate-tags'),
    path('recommend-category/', CategoryRecommendationView.as_view(), name='recommend-categories'),
    path('recommend-collaboration/', CollaborationRecommendationView.as_view(), name='recommend-collaboration'),
    path('moderate-changes/', ModerationView.as_view(), name='moderate-changes'),
]
