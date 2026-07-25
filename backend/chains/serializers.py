from rest_framework import serializers
from .models import TaskChain, Task, Enrollment


class TaskSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id", "title", "description", "order_number", "difficulty",
            "hints", "expected_output_type", "status",
        ]

    def get_status(self, obj):
        current = self.context.get("current_task_order")
        if current is None:
            return "locked"
        if obj.order_number < current:
            return "completed"
        if obj.order_number == current:
            return "current"
        return "locked"


class TaskChainListSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source="mentor.user.name", read_only=True)
    task_count = serializers.IntegerField(source="tasks.count", read_only=True)

    class Meta:
        model = TaskChain
        fields = [
            "id", "skill", "level", "title", "description",
            "mentor_name", "task_count", "created_at",
        ]


class TaskChainDetailSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source="mentor.user.name", read_only=True)
    mentor_verified = serializers.BooleanField(source="mentor.is_verified", read_only=True)
    tasks = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = TaskChain
        fields = [
            "id", "skill", "level", "title", "description",
            "mentor_name", "mentor_verified", "tasks", "progress",
        ]

    def get_tasks(self, obj):
        return TaskSerializer(obj.tasks.all(), many=True, context=self.context).data

    def get_progress(self, obj):
        total = obj.tasks.count()
        current = self.context.get("current_task_order", 1)
        if not total:
            return 0
        return round(min(current - 1, total) / total, 2)


class EnrollmentSerializer(serializers.ModelSerializer):
    chain = TaskChainListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id", "chain", "current_task_order", "status",
            "enrolled_at", "completed_at",
        ]
