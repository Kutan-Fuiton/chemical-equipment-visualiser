import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.conf import settings
import os

REQUIRED_COLUMNS = {
    "Equipment Name",
    "Type",
    "Flowrate",
    "Pressure",
    "Temperature",
}

def analyze_csv(file):
    """
    Reads CSV and returns summary statistics.
    """
    df = pd.read_csv(file)

    missing_cols = REQUIRED_COLUMNS - set(df.columns)
    if missing_cols:
        raise ValueError(f"Missing columns: {', '.join(missing_cols)}")

    return {
        "total_equipment": len(df),
        "avg_flowrate": round(df["Flowrate"].mean(), 2),
        "avg_pressure": round(df["Pressure"].mean(), 2),
        "avg_temperature": round(df["Temperature"].mean(), 2),
        "type_distribution": df["Type"].value_counts().to_dict(),
    }


def generate_pdf_report(dataset):
    """
    Generates a PDF report for a Dataset instance
    and returns the file path.
    """

    reports_dir = os.path.join(settings.BASE_DIR, "reports")
    os.makedirs(reports_dir, exist_ok=True)

    file_path = os.path.join(
        reports_dir, f"dataset_report_{dataset.id}.pdf"
    )

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Chemical Equipment Analysis Report")

    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Filename: {dataset.filename}")

    y -= 20
    c.drawString(50, y, f"Uploaded At: {dataset.uploaded_at}")

    y -= 30
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Summary Statistics")

    y -= 25
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Total Equipment: {dataset.total_equipment}")
    y -= 20
    c.drawString(50, y, f"Average Flowrate: {dataset.avg_flowrate}")
    y -= 20
    c.drawString(50, y, f"Average Pressure: {dataset.avg_pressure}")
    y -= 20
    c.drawString(50, y, f"Average Temperature: {dataset.avg_temperature}")

    y -= 30
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Equipment Type Distribution")

    y -= 25
    c.setFont("Helvetica", 12)

    for eq_type, count in dataset.type_distribution.items():
        c.drawString(60, y, f"{eq_type}: {count}")
        y -= 18

    c.showPage()
    c.save()

    return file_path
