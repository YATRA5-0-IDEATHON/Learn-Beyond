from django.urls import path
from .views import (
    passport_view,
    portfolio_by_slug_view,
    upsert_skill_report_view,
    add_study_comment_view,
    set_recommendation_view,
    mentor_students_view,
)

urlpatterns = [
    path("mentor/students/", mentor_students_view, name="mentor-students"),
    path("report/", upsert_skill_report_view, name="upsert-skill-report"),
    path("comment/", add_study_comment_view, name="add-study-comment"),
    path("recommendation/", set_recommendation_view, name="set-recommendation"),

    path("p/<slug:slug>/", portfolio_by_slug_view, name="portfolio-by-slug"),
    path("<uuid:user_id>/", passport_view, name="passport"),
]
