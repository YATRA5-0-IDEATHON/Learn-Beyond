from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from chains.models import Enrollment, Task
from .models import Submission
from .serializers import SubmissionSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_view(request):
    task_id = request.data.get("task_id")
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=404)

    prev = Submission.objects.filter(task=task, student=request.user).count()
    if prev >= 3:
        return Response({"error": "Max 3 attempts reached"}, status=400)

    # request.data is a QueryDict for multipart uploads; copy it so we keep any
    # attached files while adding the resolved task id.
    data = request.data.copy()
    data["task"] = task_id
    serializer = SubmissionSerializer(data=data)

    serializer.is_valid(raise_exception=True)
    submission = serializer.save(
        student=request.user,
        attempt_number=prev + 1,
    )
    return Response(SubmissionSerializer(submission).data, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def submission_detail_view(request, pk):
    try:
        sub = Submission.objects.get(id=pk)
    except Submission.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    if sub.student != request.user and not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Forbidden"}, status=403)
    return Response(SubmissionSerializer(sub).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mentor_pending_view(request):
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    # Only surface submissions for chains this mentor actually owns, so mentors
    # never see (or review) another mentor's students.
    subs = (
        Submission.objects.filter(
            status="pending",
            task__chain__mentor=request.user.mentor_profile,
        )
        .select_related("task", "student")
    )
    return Response(SubmissionSerializer(subs, many=True).data)



@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def review_submission_view(request, pk):
    if not hasattr(request.user, "mentor_profile"):
        return Response({"error": "Mentor only"}, status=403)
    try:
        sub = Submission.objects.get(id=pk)
    except Submission.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    new_status = request.data.get("status")
    if new_status not in ("approved", "revision_requested", "rejected"):
        return Response({"error": "Invalid status"}, status=400)

    sub.status = new_status
    sub.mentor_feedback = request.data.get("mentor_feedback", "")
    sub.feedback_tags = request.data.get("feedback_tags", [])
    sub.reviewed_at = timezone.now()
    sub.save()

    if new_status == "approved":
        enrollment = Enrollment.objects.filter(
            student=sub.student, chain=sub.task.chain
        ).first()
        if enrollment:
            enrollment.current_task_order = sub.task.order_number + 1
            enrollment.save()

    return Response(SubmissionSerializer(sub).data)
