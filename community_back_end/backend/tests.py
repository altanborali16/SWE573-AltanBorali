from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Community, PostTemplate

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'Uskudarli',
            'password': '1234',
        }
        self.user = User.objects.create_user(**self.user_data)
        self.user.set_password(self.user_data['password'])
        self.user.save()
        self.token, _ = Token.objects.get_or_create(user=self.user)

    def test_user_login(self):
        response = self.client.post(reverse('user_login'), {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_current_user_view(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(reverse('current_user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

class CommunityTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='Uskudarli', password='1234')
        self.user.set_password('1234')
        self.user.save()
        self.client.force_authenticate(user=self.user)

    def test_list_communities(self):
        Community.objects.create(name='Patates Academy', owner=self.user)
        Community.objects.create(name='Fiction2 Lovers', owner=self.user)
        response = self.client.get(reverse('user-community-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

class TemplateTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='Uskudarli', password='1234')
        self.user.set_password('1234')
        self.user.save()
        self.client.force_authenticate(user=self.user)
        self.community = Community.objects.create(name='Test Community', owner=self.user)

    def test_create_template(self):
        response = self.client.post(reverse('template-list', kwargs={'community_id': self.community.id}), {
            'name': 'Test Template',
            'settings': '[{"name": "Description", "type": "Text"}]'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PostTemplate.objects.count(), 1)
        self.assertEqual(PostTemplate.objects.get().name, 'Test Template')

    def test_list_templates(self):
        PostTemplate.objects.create(name='Template 1',settings = '[{"name": "Description", "type": "Text"}]', community=self.community, created_by=self.user)
        PostTemplate.objects.create(name='Template 2',settings = '[{"name": "Description", "type": "Text"}]', community=self.community, created_by=self.user)
        response = self.client.get(reverse('template-list', kwargs={'community_id': self.community.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_template(self):
        template = PostTemplate.objects.create(name='Template 1',settings = '[{"name": "Description", "type": "Text"}]', community=self.community, created_by=self.user)
        response = self.client.get(reverse('template-detail', kwargs={'pk': template.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Template 1')