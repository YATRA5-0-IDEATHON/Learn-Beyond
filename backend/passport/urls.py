from django.urls import path
from .views import passport_view

urlpatterns = [
    path("<uuid:user_id>/", passport_view, name="passport"),
]
