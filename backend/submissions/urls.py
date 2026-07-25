from django.urls import path
from .views import (
    submit_view, submission_detail_view,
    mentor_pending_view, review_submission_view,
)

urlpatterns = [
    path("", submit_view, name="submit"),
    path("pending/", mentor_pending_view, name="mentor_pending"),
    path("<uuid:pk>/", submission_detail_view, name="submission_detail"),
    path("<uuid:pk>/review/", review_submission_view, name="review_submission"),
]
