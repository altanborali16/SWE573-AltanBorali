"""
URL configuration for community_back_end project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from backend import views

urlpatterns = [
    path('api/register/', views.UserRegister.as_view(), name='user_register'),
    path('api/login/', views.UserLogin.as_view(), name='user_login'),
    path('api/user/', views.UserDetailView.as_view(), name='user_detail_view'),
    path('api/current_user/', views.CurrentUserView.as_view(), name='current_user'),
    path('api/update_user/', views.UserProfile.as_view(), name='user_profile'),
    path('api/communities/',  views.CommunityList.as_view(), name='community-list'),
    path('api/communities/usercommunities/',  views.UserCommunityList.as_view(), name='user-community-list'),
    path('api/community/<int:pk>/', views.CommunityDetail.as_view(), name='community-detail'),
    path('api/community/<int:community_id>/templates/', views.TemplateList.as_view(), name='template-list'),
    path('api/template/<int:pk>/', views.TemplateDetail.as_view(), name='template-detail'),
    path('api/posts/', views.PostList.as_view(), name='post-list'),
    path('api/community/<community_id>/posts/', views.CommunityPosts.as_view(), name='community-post-list'),
    path('api/follow_community/<int:community_id>/', views.FollowCommunityView.as_view(), name='follow-community'),
    path('api/unfollow_community/<int:community_id>/', views.UnfollowCommunityView.as_view(), name='unfollow_community'),
    path('api/recent_posts/', views.RecentPostsList.as_view(), name='recent_posts'),
]
