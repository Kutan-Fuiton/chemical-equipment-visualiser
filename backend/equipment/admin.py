from django.contrib import admin

# Register your models here.
from .models import Dataset

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "filename",
        "uploaded_at",
        "total_equipment",
    )
    ordering = ("-uploaded_at",)