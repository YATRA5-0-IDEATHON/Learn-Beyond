from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from mentors.models import MentorProfile
from chains.models import TaskChain
from .models import Session
from .serializers import SessionSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_session_view(request):
    mentor_id = request.data.get("mentor_id")
    chain_id = request.data.get("chain_id")
    scheduled_at = request.data.get("scheduled_at")
    try:
        mentor = MentorProfile.objects.get(id=mentor_id)
        chain = TaskChain.objects.get(id=chain_id)
    except (MentorProfile.DoesNotExist, TaskChain.DoesNotExist):
        return Response({"error": "Mentor or chain not found"}, status=404)

    session = Session.objects.create(
        mentor=mentor,
        student=request.user,
        chain=chain,
        scheduled_at=scheduled_at,
        fee_amount=mentor.session_rate,
    )
    return Response(SessionSerializer(session).data, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment_view(request):
    session_id = request.data.get("session_id")
    try:
        session = Session.objects.get(id=session_id, student=request.user)
    except Session.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)
    session.payment_status = "paid"
    session.payment_method = request.data.get("payment_method", "mock")
    session.save()
    return Response(SessionSerializer(session).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def session_detail_view(request, pk):
    try:
        session = Session.objects.get(id=pk)
    except Session.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    return Response(SessionSerializer(session).data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def session_outcome_view(request, pk):
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    try:
        session = Session.objects.get(id=pk)
    except Session.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    session.outcome = request.data.get("outcome", "")
    session.originality_verified = request.data.get("originality_verified", False)
    session.mentor_notes = request.data.get("mentor_notes", "")
    session.session_status = "completed"
    session.completed_at = timezone.now()
    session.save()
    return Response(SessionSerializer(session).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_sessions_view(request):
    sessions = Session.objects.filter(student=request.user)
    return Response(SessionSerializer(sessions, many=True).data)
