# backend/apps/authentication/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from apps.authentication.models import AuthUser

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = AuthUser.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_register_user(self):
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'full_name': 'New User'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_user(self):
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'testpass'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_change_password(self):
        url = reverse('change-password')
        data = {
            'old_password': 'testpass',
            'new_password': 'newtestpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Password changed successfully')