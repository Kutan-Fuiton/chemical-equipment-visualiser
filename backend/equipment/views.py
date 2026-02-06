from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services import analyze_csv
from .models import Dataset

from .serializers import DatasetSerializer

from rest_framework.permissions import IsAuthenticated

from django.http import FileResponse
from .services import generate_pdf_report


# Functionality of uploading CSV and getting analysis
class UploadCSVView(APIView):
    permission_classes = [IsAuthenticated]

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

        # Save to database with current user
        dataset = Dataset.objects.create(
            user=request.user,
            filename=file.name,
            total_equipment=summary["total_equipment"],
            avg_flowrate=summary["avg_flowrate"],
            avg_pressure=summary["avg_pressure"],
            avg_temperature=summary["avg_temperature"],
            type_distribution=summary["type_distribution"],
        )

        # Keep only last 5 uploads PER USER
        user_datasets = Dataset.objects.filter(user=request.user).order_by("-uploaded_at")
        if user_datasets.count() > 5:
            for old in user_datasets[5:]:
                old.delete()

        return Response(
            {
                "message": "File uploaded successfully",
                "dataset_id": dataset.id,
                "filename": file.name,
                "summary": summary
            },
            status=status.HTTP_201_CREATED
        )

# Functionality of retrieving last 5 uploads for current user
class DatasetHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Filter by current user - each user sees only their own datasets
        datasets = Dataset.objects.filter(user=request.user).order_by("-uploaded_at")[:5]
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



# Functionality of downloading PDF report
class DatasetPDFReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, dataset_id):
        try:
            # Only allow downloading reports for user's own datasets
            dataset = Dataset.objects.get(id=dataset_id, user=request.user)
        except Dataset.DoesNotExist:
            return Response(
                {"error": "Dataset not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        pdf_path = generate_pdf_report(dataset)

        return FileResponse(
            open(pdf_path, "rb"),
            content_type="application/pdf",
            as_attachment=True,
            filename=f"dataset_report_{dataset_id}.pdf",
        )

