import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for PDF generation
import matplotlib.pyplot as plt
import numpy as np
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from django.conf import settings
import os
import io

REQUIRED_COLUMNS = {
    "Equipment Name",
    "Type",
    "Flowrate",
    "Pressure",
    "Temperature",
}

def analyze_csv(file):
    """
    Reads CSV and returns comprehensive summary statistics.
    """
    df = pd.read_csv(file)

    missing_cols = REQUIRED_COLUMNS - set(df.columns)
    if missing_cols:
        raise ValueError(f"Missing columns: {', '.join(missing_cols)}")

    # Calculate per-type metrics
    type_metrics = {}
    for eq_type in df["Type"].unique():
        type_df = df[df["Type"] == eq_type]
        type_metrics[eq_type] = {
            "count": len(type_df),
            "avg_flowrate": round(type_df["Flowrate"].mean(), 2),
            "avg_pressure": round(type_df["Pressure"].mean(), 2),
            "avg_temperature": round(type_df["Temperature"].mean(), 2),
        }

    return {
        "total_equipment": len(df),
        "avg_flowrate": round(df["Flowrate"].mean(), 2),
        "avg_pressure": round(df["Pressure"].mean(), 2),
        "avg_temperature": round(df["Temperature"].mean(), 2),
        "type_distribution": df["Type"].value_counts().to_dict(),
        "type_metrics": type_metrics,
    }


def create_bar_chart(data: dict, title: str) -> io.BytesIO:
    """Generate a bar chart and return as BytesIO."""
    fig, ax = plt.subplots(figsize=(5, 3), facecolor='#151d2f')
    ax.set_facecolor('#0a0e1a')
    
    colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
    labels = list(data.keys())
    values = list(data.values())
    
    bars = ax.bar(labels, values, color=colors[:len(data)], width=0.6)
    
    ax.set_title(title, color='#f0f4f8', fontsize=12, fontweight='bold', pad=10)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    ax.set_xticklabels(labels, rotation=30, ha='right')
    ax.spines['bottom'].set_color('#334155')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#334155')
    
    # Add value labels
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
               str(int(val)), ha='center', va='bottom', 
               color='#f0f4f8', fontsize=9)
    
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, facecolor='#151d2f', edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    return buf


def create_pie_chart(data: dict, title: str) -> io.BytesIO:
    """Generate a pie chart and return as BytesIO."""
    fig, ax = plt.subplots(figsize=(5, 3), facecolor='#151d2f')
    ax.set_facecolor('#151d2f')
    
    colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
    labels = list(data.keys())
    values = list(data.values())
    total = sum(values)
    
    wedges, texts, autotexts = ax.pie(
        values, 
        labels=None,
        autopct='%1.1f%%',
        colors=colors[:len(data)],
        startangle=90,
        textprops={'color': 'white', 'fontsize': 9}
    )
    
    for autotext in autotexts:
        autotext.set_fontweight('bold')
    
    # Add legend
    legend_labels = [f'{label} ({val})' for label, val in zip(labels, values)]
    ax.legend(wedges, legend_labels, loc='center left', bbox_to_anchor=(1.0, 0.5),
              fontsize=8, frameon=False, labelcolor='#f0f4f8')
    
    ax.set_title(title, color='#f0f4f8', fontsize=12, fontweight='bold', pad=5)
    
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, facecolor='#151d2f', edgecolor='none', bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return buf


def create_metrics_bar_chart(data: dict) -> io.BytesIO:
    """Generate a grouped bar chart for average metrics."""
    fig, ax = plt.subplots(figsize=(5, 3), facecolor='#151d2f')
    ax.set_facecolor('#0a0e1a')
    
    metrics = ['Flowrate', 'Pressure', 'Temperature']
    values = [data['avg_flowrate'], data['avg_pressure'], data['avg_temperature']]
    colors = ['#63caff', '#34d399', '#fb7185']
    
    bars = ax.bar(metrics, values, color=colors, width=0.5)
    
    ax.set_title('Average Parameters', color='#f0f4f8', fontsize=12, fontweight='bold', pad=10)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    ax.spines['bottom'].set_color('#334155')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#334155')
    
    # Add value labels
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
               f'{val:.1f}', ha='center', va='bottom', 
               color='#f0f4f8', fontsize=9)
    
    plt.tight_layout()
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150, facecolor='#151d2f', edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    return buf


def generate_pdf_report(dataset):
    """
    Generates a professionally designed PDF report with charts.
    """
    reports_dir = os.path.join(settings.BASE_DIR, "reports")
    os.makedirs(reports_dir, exist_ok=True)

    file_path = os.path.join(reports_dir, f"dataset_report_{dataset.id}.pdf")

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4
    center_x = width / 2

    # Colors matching the web theme
    primary_color = HexColor("#63caff")
    secondary_color = HexColor("#34d399")
    
    # ═══════════════════════════════════════════════════════════════
    # HEADER
    # ═══════════════════════════════════════════════════════════════
    c.setFillColor(HexColor("#151d2f"))
    c.rect(0, height - 100, width, 100, fill=True, stroke=False)
    
    # Decorative accent line
    c.setStrokeColor(primary_color)
    c.setLineWidth(3)
    c.line(0, height - 100, width, height - 100)
    
    # Title - centered
    c.setFillColor(HexColor("#ffffff"))
    c.setFont("Helvetica-Bold", 26)
    title = "Chemical Equipment Analysis"
    title_width = c.stringWidth(title, "Helvetica-Bold", 26)
    c.drawString(center_x - title_width / 2, height - 50, title)
    
    # Subtitle with filename - centered
    c.setFont("Helvetica", 13)
    c.setFillColor(primary_color)
    subtitle = f"Dataset: {dataset.filename}"
    subtitle_width = c.stringWidth(subtitle, "Helvetica", 13)
    c.drawString(center_x - subtitle_width / 2, height - 75, subtitle)

    y = height - 140

    # ═══════════════════════════════════════════════════════════════
    # SUMMARY STATISTICS SECTION
    # ═══════════════════════════════════════════════════════════════
    c.setFillColor(primary_color)
    c.setFont("Helvetica-Bold", 16)
    section_title = "◆ Summary Statistics"
    section_width = c.stringWidth(section_title, "Helvetica-Bold", 16)
    c.drawString(center_x - section_width / 2, y, section_title)
    
    y -= 12
    c.setStrokeColor(HexColor("#63caff"))
    c.setLineWidth(2)
    c.line(center_x - 100, y, center_x + 100, y)
    
    y -= 35

    # Stats in a 2x2 grid - centered
    stats = [
        ("Total Equipment", str(dataset.total_equipment), "#63caff"),
        ("Avg Flowrate", f"{dataset.avg_flowrate:.2f}", "#34d399"),
        ("Avg Pressure", f"{dataset.avg_pressure:.2f}", "#fb7185"),
        ("Avg Temperature", f"{dataset.avg_temperature:.2f}°", "#fbbf24"),
    ]
    
    box_width = 130
    box_height = 55
    gap = 15
    start_x = center_x - box_width - gap / 2
    
    for i, (label, value, color) in enumerate(stats):
        row = i // 2
        col = i % 2
        
        box_x = start_x + col * (box_width + gap)
        box_y = y - row * (box_height + 12)
        
        # Box background with colored border
        c.setFillColor(HexColor("#f8fafc"))
        c.setStrokeColor(HexColor(color))
        c.setLineWidth(2)
        c.roundRect(box_x, box_y - box_height, box_width, box_height, 10, fill=True, stroke=True)
        
        # Colored accent bar at top of box
        c.setFillColor(HexColor(color))
        c.rect(box_x, box_y - 6, box_width, 6, fill=True, stroke=False)
        
        # Label
        c.setFillColor(HexColor("#64748b"))
        c.setFont("Helvetica", 10)
        label_width = c.stringWidth(label, "Helvetica", 10)
        c.drawString(box_x + box_width / 2 - label_width / 2, box_y - 22, label)
        
        # Value
        c.setFillColor(HexColor("#0f172a"))
        c.setFont("Helvetica-Bold", 20)
        value_width = c.stringWidth(value, "Helvetica-Bold", 20)
        c.drawString(box_x + box_width / 2 - value_width / 2, box_y - 47, value)

    y -= 160

    # ═══════════════════════════════════════════════════════════════
    # CHARTS SECTION
    # ═══════════════════════════════════════════════════════════════
    c.setFillColor(secondary_color)
    c.setFont("Helvetica-Bold", 16)
    section_title = "◆ Data Visualization"
    section_width = c.stringWidth(section_title, "Helvetica-Bold", 16)
    c.drawString(center_x - section_width / 2, y, section_title)
    
    y -= 12
    c.setStrokeColor(secondary_color)
    c.setLineWidth(2)
    c.line(center_x - 100, y, center_x + 100, y)
    
    y -= 20

    # Generate and embed charts
    type_dist = dataset.type_distribution
    
    # Bar chart - Equipment Distribution
    bar_img = create_bar_chart(type_dist, "Equipment Type Distribution")
    c.drawImage(ImageReader(bar_img), 50, y - 180, width=240, height=170, preserveAspectRatio=True)
    
    # Pie chart - Distribution Percentage
    pie_img = create_pie_chart(type_dist, "Type Distribution")
    c.drawImage(ImageReader(pie_img), 310, y - 180, width=240, height=170, preserveAspectRatio=True)
    
    y -= 200

    # Average metrics chart
    metrics_data = {
        'avg_flowrate': dataset.avg_flowrate,
        'avg_pressure': dataset.avg_pressure,
        'avg_temperature': dataset.avg_temperature,
    }
    metrics_img = create_metrics_bar_chart(metrics_data)
    c.drawImage(ImageReader(metrics_img), center_x - 120, y - 160, width=240, height=150, preserveAspectRatio=True)

    # ═══════════════════════════════════════════════════════════════
    # FOOTER
    # ═══════════════════════════════════════════════════════════════
    c.setFillColor(HexColor("#151d2f"))
    c.rect(0, 0, width, 40, fill=True, stroke=False)
    
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Helvetica", 10)
    footer = "Chemical Equipment Visualizer • ChemViz"
    footer_width = c.stringWidth(footer, "Helvetica", 10)
    c.drawString(center_x - footer_width / 2, 15, footer)

    c.showPage()
    c.save()

    return file_path
