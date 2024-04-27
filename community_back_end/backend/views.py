from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


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
        

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  # This will give you the authenticated user
        data = {
            'username': user.username,
            'email': user.email,
            'first_name' : user.first_name,
            'last_name' : user.last_name,
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
