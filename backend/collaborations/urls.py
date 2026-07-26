from django.urls import path
from .views import (
    create_project_view, my_projects_view, eligible_students_view,
    invite_view, review_contribution_view, complete_project_view,
    invited_projects_view, respond_invite_view, contribute_view,
    project_detail_view,
)

urlpatterns = [
    # Mentor
    path("projects/", create_project_view, name="create_project"),
    path("projects/mine/", my_projects_view, name="my_projects"),
    path("eligible-students/", eligible_students_view, name="eligible_students"),
    path("<uuid:project_id>/invite/", invite_view, name="invite_collaborator"),
    path("<uuid:project_id>/complete/", complete_project_view, name="complete_project"),
    path("contribution/<uuid:contribution_id>/review/", review_contribution_view, name="review_contribution"),
    # Student
    path("invited/", invited_projects_view, name="invited_projects"),
    path("collaborator/<uuid:collaborator_id>/respond/", respond_invite_view, name="respond_invite"),
    path("<uuid:project_id>/contribute/", contribute_view, name="contribute"),
    # Shared
    path("<uuid:project_id>/", project_detail_view, name="project_detail"),
]
