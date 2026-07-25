import os
import requests
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import RegisterSerializer, UserSerializer, StudentProfileSerializer
from .models import StudentProfile

User = get_user_model()



def tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"user": UserSerializer(user).data, **tokens_for(user)},
            status=status.HTTP_201_CREATED,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, username=email, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)
    return Response({"user": UserSerializer(user).data, **tokens_for(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def student_profile_view(request):
    profile, _ = StudentProfile.objects.get_or_create(user=request.user)
    if request.method == "PATCH":
        serializer = StudentProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    return Response(StudentProfileSerializer(profile).data)


def _get_or_create_oauth_user(email, name, provider):
    """Find an existing user by email or create a new one for social login."""
    email = email.lower().strip()
    user, created = User.objects.get_or_create(
        email=email,
        defaults={"name": name or email.split("@")[0], "auth_provider": provider},
    )
    if created:
        # Social accounts have no usable password; login is via provider only.
        user.set_unusable_password()
        user.auth_provider = provider
        user.save()
    return user


def _google_profile(code, redirect_uri):
    """Exchange a Google authorization code for the user's profile."""
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if not client_id or not client_secret:
        return None, "Google OAuth is not configured on the server."

    token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=10,
    )
    if token_resp.status_code != 200:
        return None, "Failed to exchange Google authorization code."
    access_token = token_resp.json().get("access_token")

    info_resp = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    if info_resp.status_code != 200:
        return None, "Failed to fetch Google profile."
    data = info_resp.json()
    email = data.get("email")
    if not email:
        return None, "Google account did not return an email."
    return {"email": email, "name": data.get("name", "")}, None


def _linkedin_profile(code, redirect_uri):
    """Exchange a LinkedIn authorization code for the user's profile (OpenID Connect)."""
    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    if not client_id or not client_secret:
        return None, "LinkedIn OAuth is not configured on the server."

    token_resp = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": client_id,
            "client_secret": client_secret,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10,
    )
    if token_resp.status_code != 200:
        return None, "Failed to exchange LinkedIn authorization code."
    access_token = token_resp.json().get("access_token")

    # LinkedIn OpenID Connect userinfo endpoint returns email + name.
    info_resp = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    if info_resp.status_code != 200:
        return None, "Failed to fetch LinkedIn profile."
    data = info_resp.json()
    email = data.get("email")
    if not email:
        return None, "LinkedIn account did not return an email."
    return {"email": email, "name": data.get("name", "")}, None


@api_view(["POST"])
@permission_classes([AllowAny])
def oauth_exchange_view(request, provider):
    """
    Exchange an OAuth authorization code (from Google or LinkedIn) for app JWTs.
    Body: { "code": "<authorization_code>", "redirect_uri": "<redirect_uri>" }
    """
    code = request.data.get("code")
    redirect_uri = request.data.get("redirect_uri")
    if not code or not redirect_uri:
        return Response({"error": "Missing code or redirect_uri."}, status=400)

    if provider == "google":
        profile, err = _google_profile(code, redirect_uri)
    elif provider == "linkedin":
        profile, err = _linkedin_profile(code, redirect_uri)
    else:
        return Response({"error": "Unsupported provider."}, status=400)

    if err:
        return Response({"error": err}, status=400)

    user = _get_or_create_oauth_user(profile["email"], profile["name"], provider)
    return Response({"user": UserSerializer(user).data, **tokens_for(user)})


