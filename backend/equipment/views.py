from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services import analyze_csv
from .models import Dataset

class UploadCSVView(APIView):
    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "CSV file is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            summary = analyze_csv(file)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save to database
        dataset = Dataset.objects.create(
            filename=file.name,
            total_equipment=summary["total_equipment"],
            avg_flowrate=summary["avg_flowrate"],
            avg_pressure=summary["avg_pressure"],
            avg_temperature=summary["avg_temperature"],
            type_distribution=summary["type_distribution"],
        )

        # Keep only last 5 uploads
        datasets = Dataset.objects.order_by("-uploaded_at")
        if datasets.count() > 5:
            for old in datasets[5:]:
                old.delete()

        return Response(
            {
                "message": "File uploaded successfully",
                "dataset_id": dataset.id,
                "summary": summary
            },
            status=status.HTTP_201_CREATED
        )

