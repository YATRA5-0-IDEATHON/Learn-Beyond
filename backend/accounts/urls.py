from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, login_view, me_view, student_profile_view, oauth_exchange_view
from .ai_views import ai_onboard_view

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", login_view, name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", me_view, name="me"),
    path("student/profile/", student_profile_view, name="student_profile"),
    path("ai/onboard/", ai_onboard_view, name="ai_onboard"),
    path("oauth/<str:provider>/", oauth_exchange_view, name="oauth_exchange"),
]


