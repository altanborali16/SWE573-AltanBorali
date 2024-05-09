from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, CommunitySerializer, PostTemplateSerializer, PostSerializer,CurrentUserSerializer
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Community, PostTemplate, Post
from django.http import Http404
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


class UserRegister(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class UserLogin(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        username = serializer.initial_data['username']
        password = serializer.initial_data['password']
        try:
            user = User.objects.get(username=username)
        except ObjectDoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'token': token.key
            })
        else:
            return Response({'error': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  # This will give you the authenticated user
        data = {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
        return Response(data)


class UserProfile(APIView):
    def put(self, request, *args, **kwargs):
        user = request.user  # Assuming the user is authenticated
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommunityList(APIView):
    def get(self, request):
        communities = Community.objects.filter(is_deleted=False)
        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommunitySerializer(data=request.data)
        print("user : " , request.user)
        print("Is ok : " , serializer.is_valid())
        if serializer.is_valid():
            serializer.validated_data['owner'] = request.user  # Set owner after validation
            serializer.save()
            # Create default template
            default_template_data = {
                'name': 'Default Template',
                'community': serializer.instance.id,
                'settings': '[{"name": "Description", "type": "Text"}]',  # Default settings as JSON string
                'created_by': request.user.id,
            }
            template_serializer = PostTemplateSerializer(data=default_template_data)
            if template_serializer.is_valid():
                template_serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCommunityList(APIView):
    def get(self, request):
        user = request.user
        communities = Community.objects.filter(owner=user) | Community.objects.filter(followers=user)
        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data)
    
class CommunityDetail(APIView):
    def get_object(self, pk):
        try:
            return Community.objects.get(pk=pk)
        except Community.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        community = self.get_object(pk)
        serializer = CommunitySerializer(community)
        return Response(serializer.data)

    def put(self, request, pk):
        community = self.get_object(pk)
        serializer = CommunitySerializer(community, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        community = self.get_object(pk)
        community.is_deleted = True
        community.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

def follow_community(request, community_id):
    print("Here")
    community = get_object_or_404(Community, id=community_id)
    user = request.user  # Assuming user is authenticated
    if user not in community.followers.all():
        community.followers.add(user)
        return JsonResponse({'message': f'You have followed {community.name}'})
    else:
        return JsonResponse({'message': f'You are already following {community.name}'})
    
class TemplateList(APIView):
    def get(self, request, community_id):
        templates = PostTemplate.objects.filter(community_id=community_id)
        serializer = PostTemplateSerializer(templates, many=True)
        return Response(serializer.data)

    def post(self, request, community_id):
        data = request.data.copy()  # Make a copy to avoid modifying the original data
        data['community'] = community_id  # Set the community ID in the data
        data['created_by'] = request.user.id
        serializer = PostTemplateSerializer(data=data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TemplateDetail(APIView):
    def get_object(self, pk):
        try:
            return PostTemplate.objects.get(pk=pk)
        except PostTemplate.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        template = self.get_object(pk)
        serializer = PostTemplateSerializer(template)
        return Response(serializer.data)

    def put(self, request, pk):
        template = self.get_object(pk)
        serializer = PostTemplateSerializer(template, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        template = self.get_object(pk)
        template.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PostList(APIView):
    def post(self, request):
        request_data = request.data.copy()
        print(request.data)
        template_id = request_data.pop('template_id', None)
        community_id = request_data.pop('community_id', None)
        
        if template_id is None or community_id is None:
            return Response({'error': 'Template ID and community ID are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        request_data.setdefault('community', request.data['community_id'])
        request_data.setdefault('template', request.data['template_id'])

        serializer = PostSerializer(data=request_data)
        if serializer.is_valid():
            serializer.validated_data['user'] = request.user
            serializer.save(template_id=template_id, community_id=community_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommunityPosts(APIView):
    def get(self, request, community_id):
        posts = Post.objects.filter(community_id=community_id)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
