from django.urls import path
from .views import ChainListView, ChainDetailView, enroll_view, my_enrollments_view
from .ai_views import generate_chain_view, create_chain_view, my_chains_view

urlpatterns = [
    path("", ChainListView.as_view(), name="chain_list"),
    path("generate/", generate_chain_view, name="chain_generate"),
    path("create/", create_chain_view, name="chain_create"),
    path("mine/", my_chains_view, name="chain_mine"),
    path("enroll/", enroll_view, name="enroll"),
    path("my/", my_enrollments_view, name="my_enrollments"),
    path("<uuid:id>/", ChainDetailView.as_view(), name="chain_detail"),
]


