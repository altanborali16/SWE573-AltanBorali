from django.db import models
from django.contrib.auth.models import User

class Community(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_private = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    followers = models.ManyToManyField(User, related_name='followed_communities')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_communities')
    managers = models.ManyToManyField(User, related_name='managed_communities')

class PostTemplate(models.Model):
    name = models.CharField(max_length=255)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='templates')
    settings = models.JSONField()  # Assuming settings will be stored as JSON
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    input = models.JSONField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts')
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    template = models.ForeignKey(PostTemplate, on_delete=models.CASCADE)

class Comment(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
