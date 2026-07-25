from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import TaskChain, Enrollment
from .serializers import TaskChainListSerializer, TaskChainDetailSerializer, EnrollmentSerializer


class ChainListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskChainListSerializer

    def get_queryset(self):
        qs = TaskChain.objects.filter(is_published=True)
        skill = self.request.query_params.get("skill")
        level = self.request.query_params.get("level")
        if skill:
            qs = qs.filter(skill=skill)
        if level:
            qs = qs.filter(level=level)
        return qs


class ChainDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = TaskChain.objects.filter(is_published=True)
    lookup_field = "id"

    def get_serializer(self, *args, **kwargs):
        chain = self.get_object()
        enrollment = Enrollment.objects.filter(
            student=self.request.user, chain=chain
        ).first()
        current = enrollment.current_task_order if enrollment else None
        kwargs["context"] = {**self.get_serializer_context(), "current_task_order": current}
        return TaskChainDetailSerializer(*args, **kwargs)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def enroll_view(request):
    chain_id = request.data.get("chain_id")
    try:
        chain = TaskChain.objects.get(id=chain_id, is_published=True)
    except TaskChain.DoesNotExist:
        return Response({"error": "Chain not found"}, status=404)
    enrollment, created = Enrollment.objects.get_or_create(
        student=request.user, chain=chain
    )
    return Response(
        EnrollmentSerializer(enrollment).data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_enrollments_view(request):
    enrollments = Enrollment.objects.filter(student=request.user).select_related("chain")
    return Response(EnrollmentSerializer(enrollments, many=True).data)
