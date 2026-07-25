from django.urls import path
from .views import (
    issue_certification_view, student_certifications_view,
    verify_certification_view, mentor_ready_view, complete_and_certify_view,
)

urlpatterns = [
    path("issue/", issue_certification_view, name="issue_cert"),
    path("ready/", mentor_ready_view, name="mentor_ready"),
    path("complete/", complete_and_certify_view, name="complete_certify"),
    path("student/<uuid:student_id>/", student_certifications_view, name="student_certs"),
    path("verify/<str:cert_unique_id>/", verify_certification_view, name="verify_cert"),
]
