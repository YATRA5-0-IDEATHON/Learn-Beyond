from django.contrib import admin
from .models import TaskChain, Task, Enrollment

admin.site.register(TaskChain)
admin.site.register(Task)
admin.site.register(Enrollment)
