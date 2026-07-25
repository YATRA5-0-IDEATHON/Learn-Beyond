from django.urls import path
from .views import MentorListView, MentorDetailView

urlpatterns = [
    path("", MentorListView.as_view(), name="mentor_list"),
    path("<uuid:id>/", MentorDetailView.as_view(), name="mentor_detail"),
]
