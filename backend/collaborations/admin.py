from django.contrib import admin
from .models import Project, Collaborator, Contribution


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "mentor", "skill", "budget", "status", "created_at")
    list_filter = ("status", "skill")


@admin.register(Collaborator)
class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ("student", "project", "status", "pay_share", "net_earnings", "paid")
    list_filter = ("status", "paid")


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ("collaborator", "project", "status", "submitted_at")
    list_filter = ("status",)
