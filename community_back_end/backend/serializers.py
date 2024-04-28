from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Community, PostTemplate, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CommunitySerializer(serializers.ModelSerializer):
    owner = UserSerializer(required=False)
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'is_private',
                  'owner', 'managers', 'followers', 'is_deleted']
        extra_kwargs = {
            'managers': {'required': False},
            'followers': {'required': False},
        }

class PostTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostTemplate
        fields = ['id', 'name', 'community', 'settings', 'created_by', 'created_date']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    class Meta:
        model = Post
        fields = '__all__'  # You can specify the fields explicitly if needed
