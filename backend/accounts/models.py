from django.contrib.auth.models import AbstractUser
from django.db import models


class Role(models.TextChoices):
    CITIZEN = "citizen", "Citizen"
    ADMIN = "admin", "Admin"
    MANAGER = "manager", "Manager/Team Leader"
    WORKER = "worker", "Field Worker"


class User(AbstractUser):
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CITIZEN)

    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)

    province = models.CharField(max_length=100, blank=True)
    division = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    tehsil = models.CharField(max_length=100, blank=True)
    area = models.CharField(max_length=100, blank=True)

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class Team(models.Model):
    name = models.CharField(max_length=150)
    manager = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="managed_teams", limit_choices_to={"role": Role.MANAGER},
    )
    members = models.ManyToManyField(
        User, related_name="teams", blank=True,
        limit_choices_to={"role": Role.WORKER},
    )
    district = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
