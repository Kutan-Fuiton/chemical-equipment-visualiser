from django.urls import path
from .views import UploadCSVView, DatasetHistoryView, DatasetPDFReportView

urlpatterns = [
    path("upload/", UploadCSVView.as_view(), name="upload-csv"),
    path("history/", DatasetHistoryView.as_view(), name="dataset-history"),
    path("report/<int:dataset_id>/", DatasetPDFReportView.as_view(), name="dataset-report"),
]