from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from mentors.models import MentorProfile
from chains.models import TaskChain, Task
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
    sessions = Session.objects.filter(student=request.user).order_by("-created_at")
    return Response(SessionSerializer(sessions, many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def request_session_view(request):
    """Student requests a video review call for a specific task."""
    task_id = request.data.get("task_id")
    try:
        task = Task.objects.select_related("chain", "chain__mentor").get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=404)

    chain = task.chain
    mentor = chain.mentor

    # Reuse an open request/schedule for this task instead of duplicating.
    session = Session.objects.filter(
        student=request.user, task=task,
        session_status__in=["requested", "scheduled"],
    ).first()
    if session:
        return Response(SessionSerializer(session).data, status=200)

    session = Session.objects.create(
        mentor=mentor,
        student=request.user,
        chain=chain,
        task=task,
        fee_amount=0,  # per-task review calls are free in the demo
        payment_status="paid",
        session_status="requested",
    )
    return Response(SessionSerializer(session).data, status=201)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def schedule_session_view(request, pk):
    """Mentor picks the date/time for a requested session."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    try:
        session = Session.objects.get(id=pk)
    except Session.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    scheduled_at = request.data.get("scheduled_at")
    if not scheduled_at:
        return Response({"error": "scheduled_at is required"}, status=400)

    session.scheduled_at = scheduled_at
    session.duration_minutes = request.data.get("duration_minutes", session.duration_minutes)
    session.session_status = "scheduled"
    session.save()
    return Response(SessionSerializer(session).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mentor_sessions_view(request):
    """All sessions belonging to the logged-in mentor."""
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    sessions = Session.objects.filter(
        mentor=request.user.mentor_profile
    ).order_by("-created_at")
    return Response(SessionSerializer(sessions, many=True).data)
