from django.urls import path
from .views import ChainListView, ChainDetailView, enroll_view, my_enrollments_view

urlpatterns = [
    path("", ChainListView.as_view(), name="chain_list"),
    path("<uuid:id>/", ChainDetailView.as_view(), name="chain_detail"),
    path("enroll/", enroll_view, name="enroll"),
    path("my/", my_enrollments_view, name="my_enrollments"),
]
