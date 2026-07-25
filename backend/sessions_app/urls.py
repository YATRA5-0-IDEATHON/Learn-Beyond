from django.urls import path
from .views import (
    book_session_view, verify_payment_view, session_detail_view,
    session_outcome_view, my_sessions_view,
)

urlpatterns = [
    path("book/", book_session_view, name="book_session"),
    path("payment/verify/", verify_payment_view, name="verify_payment"),
    path("my/", my_sessions_view, name="my_sessions"),
    path("<uuid:pk>/", session_detail_view, name="session_detail"),
    path("<uuid:pk>/outcome/", session_outcome_view, name="session_outcome"),
]
