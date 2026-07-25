from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import MentorProfile
from .serializers import MentorProfileSerializer


class MentorListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MentorProfileSerializer

    def get_queryset(self):
        qs = MentorProfile.objects.filter(is_verified=True)
        skill = self.request.query_params.get("skill")
        if skill:
            qs = [m for m in qs if skill in m.skills]
            return qs
        sort = self.request.query_params.get("sort")
        if sort == "rating":
            qs = qs.order_by("-rating")
        elif sort == "sessions":
            qs = qs.order_by("-total_sessions")
        elif sort == "price":
            qs = qs.order_by("session_rate")
        return qs


class MentorDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = MentorProfileSerializer
    queryset = MentorProfile.objects.all()
    lookup_field = "id"
