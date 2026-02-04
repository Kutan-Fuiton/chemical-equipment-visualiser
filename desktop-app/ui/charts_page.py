"""
Charts Page - Data visualization with matplotlib
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QFrame, QGridLayout, QScrollArea
)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont

from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt


class StatCard(QFrame):
    """Card widget displaying a single statistic."""

    def __init__(self, title: str, value: str, icon: str = "📊"):
        super().__init__()
        self.setObjectName("statCard")
        
        layout = QVBoxLayout(self)
        layout.setSpacing(8)

        # Icon and title row
        header = QHBoxLayout()
        
        icon_label = QLabel(icon)
        icon_label.setFont(QFont("Segoe UI Emoji", 20))
        header.addWidget(icon_label)
        
        title_label = QLabel(title)
        title_label.setObjectName("statTitle")
        header.addWidget(title_label)
        header.addStretch()
        
        layout.addLayout(header)

        # Value
        value_label = QLabel(value)
        value_label.setObjectName("statValue")
        value_label.setFont(QFont("Segoe UI", 28, QFont.Weight.Bold))
        layout.addWidget(value_label)


class ChartWidget(QFrame):
    """Widget containing a matplotlib chart."""

    def __init__(self, title: str):
        super().__init__()
        self.setObjectName("chartCard")
        
        layout = QVBoxLayout(self)
        
        # Title
        title_label = QLabel(title)
        title_label.setObjectName("chartTitle")
        title_label.setFont(QFont("Segoe UI", 14, QFont.Weight.Bold))
        layout.addWidget(title_label)

        # Chart canvas with web frontend colors
        self.figure = Figure(figsize=(5, 4), facecolor='#151d2f')
        self.canvas = FigureCanvas(self.figure)
        self.canvas.setStyleSheet("background-color: #151d2f;")
        layout.addWidget(self.canvas)

    def plot_bar(self, data: dict, xlabel: str = "", ylabel: str = ""):
        """Plot a bar chart."""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        # Style matching web frontend
        ax.set_facecolor('#0a0e1a')
        ax.tick_params(colors='#f0f4f8', labelsize=10)
        ax.spines['bottom'].set_color('#334155')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#334155')

        # Plot with web frontend colors
        colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
        bars = ax.bar(list(data.keys()), list(data.values()), 
                      color=colors[:len(data)])
        
        ax.set_xlabel(xlabel, color='#94a3b8', fontsize=11)
        ax.set_ylabel(ylabel, color='#94a3b8', fontsize=11)
        
        # Rotate labels if many items
        if len(data) > 4:
            plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')
        
        self.figure.tight_layout()
        self.canvas.draw()

    def plot_pie(self, data: dict):
        """Plot a pie chart."""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        ax.set_facecolor('#151d2f')

        # Web frontend colors
        colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
        
        wedges, texts, autotexts = ax.pie(
            list(data.values()), 
            labels=list(data.keys()),
            autopct='%1.1f%%',
            colors=colors[:len(data)],
            textprops={'color': '#f0f4f8', 'fontsize': 11}
        )
        
        for autotext in autotexts:
            autotext.set_color('#0a0e1a')
            autotext.set_fontweight('bold')

        self.figure.tight_layout()
        self.canvas.draw()


class ChartsPage(QWidget):
    """Page displaying analysis charts and statistics."""

    def __init__(self):
        super().__init__()
        self.setup_ui()

    def setup_ui(self):
        # Scroll area for content
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("chartsScroll")
        
        content = QWidget()
        self.layout = QVBoxLayout(content)
        self.layout.setContentsMargins(40, 40, 40, 40)
        self.layout.setSpacing(20)

        # Header
        header = QLabel("Analysis Results")
        header.setObjectName("pageTitle")
        header.setFont(QFont("Segoe UI", 24, QFont.Weight.Bold))
        self.layout.addWidget(header)

        self.description = QLabel("Upload a dataset to see analysis results.")
        self.description.setObjectName("pageDescription")
        self.layout.addWidget(self.description)

        # Stats grid
        self.stats_grid = QGridLayout()
        self.stats_grid.setSpacing(20)
        self.layout.addLayout(self.stats_grid)

        # Charts container
        self.charts_layout = QVBoxLayout()
        self.charts_layout.setSpacing(20)
        self.layout.addLayout(self.charts_layout)

        self.layout.addStretch()

        scroll.setWidget(content)
        
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.addWidget(scroll)

    def clear_charts(self):
        """Remove all charts and stats."""
        # Clear stats
        while self.stats_grid.count():
            item = self.stats_grid.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        
        # Clear charts
        while self.charts_layout.count():
            item = self.charts_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

    def display_results(self, data: dict):
        """Display analysis results from API response."""
        self.clear_charts()
        
        summary = data.get("summary", data)
        
        # Update description
        self.description.setText(f"Analysis complete for dataset #{data.get('dataset_id', 'N/A')}")

        # Stats cards
        stats = [
            ("Total Equipment", str(summary.get("total_equipment", 0)), "🔧"),
            ("Avg Flowrate", f"{summary.get('avg_flowrate', 0):.2f}", "💨"),
            ("Avg Pressure", f"{summary.get('avg_pressure', 0):.2f}", "⚡"),
            ("Avg Temperature", f"{summary.get('avg_temperature', 0):.2f}°", "🌡️"),
        ]

        for i, (title, value, icon) in enumerate(stats):
            card = StatCard(title, value, icon)
            self.stats_grid.addWidget(card, 0, i)

        # Type distribution bar chart
        type_dist = summary.get("type_distribution", {})
        if type_dist:
            bar_chart = ChartWidget("Equipment Type Distribution")
            bar_chart.plot_bar(type_dist, xlabel="Type", ylabel="Count")
            self.charts_layout.addWidget(bar_chart)

            # Pie chart
            pie_chart = ChartWidget("Type Distribution (Percentage)")
            pie_chart.plot_pie(type_dist)
            self.charts_layout.addWidget(pie_chart)

    def display_from_history(self, dataset: dict):
        """Display results from a history dataset."""
        self.clear_charts()
        
        self.description.setText(f"Dataset: {dataset.get('filename', 'Unknown')}")

        # Stats cards
        stats = [
            ("Total Equipment", str(dataset.get("total_equipment", 0)), "🔧"),
            ("Avg Flowrate", f"{dataset.get('avg_flowrate', 0):.2f}", "💨"),
            ("Avg Pressure", f"{dataset.get('avg_pressure', 0):.2f}", "⚡"),
            ("Avg Temperature", f"{dataset.get('avg_temperature', 0):.2f}°", "🌡️"),
        ]

        for i, (title, value, icon) in enumerate(stats):
            card = StatCard(title, value, icon)
            self.stats_grid.addWidget(card, 0, i)

        # Type distribution
        type_dist = dataset.get("type_distribution", {})
        if type_dist:
            bar_chart = ChartWidget("Equipment Type Distribution")
            bar_chart.plot_bar(type_dist, xlabel="Type", ylabel="Count")
            self.charts_layout.addWidget(bar_chart)

            pie_chart = ChartWidget("Type Distribution (Percentage)")
            pie_chart.plot_pie(type_dist)
            self.charts_layout.addWidget(pie_chart)
