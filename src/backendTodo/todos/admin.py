from django.contrib import admin
from .models import CustomUser, List, Task, Subtasks

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(List)
admin.site.register(Task)
admin.site.register(Subtasks)
