from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/mentors/", include("mentors.urls")),
    path("api/chains/", include("chains.urls")),
    path("api/submissions/", include("submissions.urls")),
    path("api/sessions/", include("sessions_app.urls")),
    path("api/certifications/", include("certifications.urls")),
    path("api/passport/", include("passport.urls")),
]
