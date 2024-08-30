from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from apps.campaigns.models import Campaign, CampaignVisit, CampaignLike
from apps.users.models import UserProfile, UserSavedCampaign
from apps.authentication.models import AuthUser

class CampaignsTests(APITestCase):
    def setUp(self):
        self.user = AuthUser.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            name="Test",
            surname="User",
            email="testuser@example.com",
            phone_number="1234567890"
        )
        self.campaign = Campaign.objects.create(
            title="Test Campaign",
            description="Test Description",
            location="Test Location",
            currency="usd",
            goal_amount=1000,
            min_investment=100.0,
            start_date="2024-01-01",
            end_date="2024-12-31",
            creator=self.user_profile
        )

    def test_campaign_list(self):
        url = reverse('campaign-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], self.campaign.title)

    def test_campaign_detail(self):
        url = reverse('campaign-detail', args=[self.campaign.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.campaign.title)

    # def test_campaign_visit(self):
    #     url = reverse('campaign-visit', args=[self.campaign.id])
    #     response = self.client.post(url, {})
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertTrue(CampaignVisit.objects.filter(campaign=self.campaign, user=self.user_profile).exists())

    def test_campaign_like(self):
        url = reverse('campaign-like', args=[self.campaign.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(CampaignLike.objects.filter(campaign=self.campaign, user=self.user_profile, is_active=True).exists())

    def test_campaign_save(self):
        url = reverse('campaign-save', args=[self.campaign.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(UserSavedCampaign.objects.filter(campaign=self.campaign, user=self.user_profile, is_active=True).exists())

    # def test_campaign_investment(self):
    #     url = reverse('campaign-invest', args=[self.campaign.id])
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['min_investment'], format(self.campaign.min_investment, '.1f'))
    #     self.assertEqual(response.data['campaign_name'], self.campaign.title)
    #     self.assertEqual(response.data['address'], self.campaign.location)
