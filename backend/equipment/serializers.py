from rest_framework import serializers
from .models import Dataset

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = [
            "id",
            "filename",
            "uploaded_at",
            "total_equipment",
            "avg_flowrate",
            "avg_pressure",
            "avg_temperature",
            "type_distribution",
        ]
