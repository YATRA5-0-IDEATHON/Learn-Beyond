from django.contrib import admin
from .models import SkillReport, StudyComment


@admin.register(SkillReport)
class SkillReportAdmin(admin.ModelAdmin):
    list_display = ("student", "skill_area", "grade", "practical_hours", "tasks_completed", "tasks_total")
    search_fields = ("student__name", "skill_area")


@admin.register(StudyComment)
class StudyCommentAdmin(admin.ModelAdmin):
    list_display = ("student", "mentor", "created_at")
    search_fields = ("student__name", "text")
