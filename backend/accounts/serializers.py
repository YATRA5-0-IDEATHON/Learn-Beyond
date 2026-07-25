from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile
from mentors.models import MentorProfile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    linkedin_url = serializers.URLField(write_only=True, required=False, allow_blank=True)
    job_title = serializers.CharField(write_only=True, required=False, allow_blank=True)
    employer = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["name", "email", "password", "role", "linkedin_url", "job_title", "employer"]

    def create(self, validated_data):
        linkedin_url = validated_data.pop("linkedin_url", "")
        job_title = validated_data.pop("job_title", "")
        employer = validated_data.pop("employer", "")
        user = User.objects.create_user(**validated_data)
        if user.role == "mentor":
            MentorProfile.objects.create(
                user=user,
                linkedin_url=linkedin_url or "",
                job_title=job_title or "",
                employer=employer or "",
            )
        else:
            StudentProfile.objects.create(user=user, linkedin_url=linkedin_url or "")
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "role", "created_at"]


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = "__all__"
