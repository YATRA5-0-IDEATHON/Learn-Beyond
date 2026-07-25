from rest_framework import serializers
from .models import MentorProfile, MentorAvailability


class MentorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorAvailability
        fields = ["id", "day_of_week", "start_time", "end_time", "is_booked"]


class MentorProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name", read_only=True)
    availability = MentorAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = MentorProfile
        fields = [
            "id", "name", "linkedin_url", "job_title", "employer",
            "years_experience", "skills", "teaching_levels", "session_rate",
            "bio", "is_verified", "rating", "total_sessions", "availability",
        ]
