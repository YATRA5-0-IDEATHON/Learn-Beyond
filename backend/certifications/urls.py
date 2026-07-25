from django.urls import path
from .views import (
    issue_certification_view, student_certifications_view,
    verify_certification_view,
)

urlpatterns = [
    path("issue/", issue_certification_view, name="issue_cert"),
    path("student/<uuid:student_id>/", student_certifications_view, name="student_certs"),
    path("verify/<str:cert_unique_id>/", verify_certification_view, name="verify_cert"),
]
