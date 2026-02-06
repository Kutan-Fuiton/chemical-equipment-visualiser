"""
Charts Page - Data visualization with matplotlib
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QFrame, QGridLayout, QScrollArea, QPushButton
)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QFont

from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import numpy as np


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
        self.setMinimumHeight(350)  # Ensure minimum height for charts
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 15, 20, 20)
        
        # Title
        title_label = QLabel(title)
        title_label.setObjectName("chartTitle")
        title_label.setFont(QFont("Segoe UI", 14, QFont.Weight.Bold))
        layout.addWidget(title_label)

        # Chart canvas with web frontend colors - larger figure size
        self.figure = Figure(figsize=(10, 5), facecolor='#151d2f')
        self.canvas = FigureCanvas(self.figure)
        self.canvas.setStyleSheet("background-color: #151d2f;")
        self.canvas.setMinimumHeight(280)
        layout.addWidget(self.canvas)

    def plot_bar(self, data: dict, xlabel: str = "", ylabel: str = ""):
        """Plot a bar chart."""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        # Style matching web frontend
        ax.set_facecolor('#0a0e1a')
        ax.tick_params(colors='#f0f4f8', labelsize=11)
        ax.spines['bottom'].set_color('#334155')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#334155')

        # Plot with web frontend colors
        colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
        x_labels = list(data.keys())
        values = list(data.values())
        
        x_positions = range(len(x_labels))
        bars = ax.bar(x_positions, values, color=colors[:len(data)], width=0.6)
        
        # Set x-tick labels with full names
        ax.set_xticks(x_positions)
        ax.set_xticklabels(x_labels, rotation=30, ha='right', fontsize=10)
        
        ax.set_xlabel(xlabel, color='#94a3b8', fontsize=11)
        ax.set_ylabel(ylabel, color='#94a3b8', fontsize=11)
        
        # Add value labels on top of bars
        for bar, val in zip(bars, values):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                   str(int(val)), ha='center', va='bottom', 
                   color='#f0f4f8', fontsize=10)
        
        self.figure.tight_layout(pad=2.0)
        self.canvas.draw()

    def plot_pie(self, data: dict):
        """Plot a pie chart with legend instead of inline labels."""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        ax.set_facecolor('#151d2f')

        # Web frontend colors
        colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
        
        labels = list(data.keys())
        values = list(data.values())
        total = sum(values)
        
        # Create pie without labels (we'll use legend)
        wedges = ax.pie(
            values, 
            colors=colors[:len(data)],
            startangle=90,
        )[0]  # Only get wedges from the tuple
        
        # Add percentages inside wedges
        for i, (wedge, val) in enumerate(zip(wedges, values)):
            pct = val / total * 100
            angle = (wedge.theta2 + wedge.theta1) / 2
            x = 0.6 * wedge.r * np.cos(np.radians(angle))
            y = 0.6 * wedge.r * np.sin(np.radians(angle))
            ax.text(x, y, f'{pct:.1f}%', ha='center', va='center',
                   color='white', fontsize=10, fontweight='bold')
        
        # Add legend outside the pie
        legend_labels = [f'{label} ({val})' for label, val in zip(labels, values)]
        ax.legend(wedges, legend_labels, 
                  loc='center left', 
                  bbox_to_anchor=(1.0, 0.5),
                  fontsize=10,
                  frameon=False,
                  labelcolor='#f0f4f8')
        
        ax.axis('equal')
        self.figure.tight_layout(pad=1.5)
        self.canvas.draw()

    def plot_grouped_bar(self, type_metrics: dict):
        """Plot a grouped bar chart comparing metrics across equipment types."""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        # Style
        ax.set_facecolor('#0a0e1a')
        ax.tick_params(colors='#f0f4f8', labelsize=10)
        ax.spines['bottom'].set_color('#334155')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#334155')

        types = list(type_metrics.keys())
        x = np.arange(len(types))
        width = 0.25
        
        # Extract metrics
        flowrates = [type_metrics[t].get('avg_flowrate', 0) for t in types]
        pressures = [type_metrics[t].get('avg_pressure', 0) for t in types]
        temps = [type_metrics[t].get('avg_temperature', 0) for t in types]
        
        # Create bars
        bars1 = ax.bar(x - width, flowrates, width, label='Flowrate', color='#63caff')
        bars2 = ax.bar(x, pressures, width, label='Pressure', color='#34d399')
        bars3 = ax.bar(x + width, temps, width, label='Temperature', color='#fb7185')
        
        ax.set_xticks(x)
        ax.set_xticklabels(types, rotation=30, ha='right', fontsize=9)
        ax.set_ylabel('Value', color='#94a3b8', fontsize=11)
        ax.legend(loc='upper right', frameon=False, labelcolor='#f0f4f8', fontsize=9)
        
        self.figure.tight_layout(pad=2.0)
        self.canvas.draw()

    def plot_horizontal_bar(self, data: dict):
        """Plot a horizontal bar chart (ranking)."""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        # Style
        ax.set_facecolor('#0a0e1a')
        ax.tick_params(colors='#f0f4f8', labelsize=11)
        ax.spines['bottom'].set_color('#334155')
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_color('#334155')

        # Sort by value descending
        sorted_data = sorted(data.items(), key=lambda x: x[1], reverse=True)
        labels = [item[0] for item in sorted_data]
        values = [item[1] for item in sorted_data]
        
        colors = ['#63caff', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#38bdf8']
        bar_colors = [colors[i % len(colors)] for i in range(len(labels))]
        
        y_pos = range(len(labels))
        bars = ax.barh(y_pos, values, color=bar_colors, height=0.6)
        
        ax.set_yticks(y_pos)
        ax.set_yticklabels(labels)
        ax.set_xlabel('Count', color='#94a3b8', fontsize=11)
        ax.invert_yaxis()  # Highest at top
        
        # Add value labels
        for bar, val in zip(bars, values):
            ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height()/2,
                   str(int(val)), ha='left', va='center', 
                   color='#f0f4f8', fontsize=10)
        
        self.figure.tight_layout(pad=2.0)
        self.canvas.draw()


class ChartsPage(QWidget):
    """Page displaying analysis charts and statistics."""

    back_to_upload = pyqtSignal()

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
        self.layout.setSpacing(24)

        # Header with back button
        header_layout = QHBoxLayout()
        
        header = QLabel("Analysis Results")
        header.setObjectName("pageTitle")
        header.setFont(QFont("Segoe UI", 24, QFont.Weight.Bold))
        header_layout.addWidget(header)
        
        header_layout.addStretch()
        
        # Upload another button
        upload_again_btn = QPushButton("📤 Upload Another")
        upload_again_btn.setObjectName("secondaryButton")
        upload_again_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        upload_again_btn.clicked.connect(self.back_to_upload.emit)
        header_layout.addWidget(upload_again_btn)
        
        self.layout.addLayout(header_layout)

        self.description = QLabel("Upload a dataset to see analysis results.")
        self.description.setObjectName("pageDescription")
        self.layout.addWidget(self.description)

        # Stats grid - horizontal row
        self.stats_grid = QGridLayout()
        self.stats_grid.setSpacing(16)
        self.layout.addLayout(self.stats_grid)

        # Charts container - 2 column grid layout
        self.charts_grid = QGridLayout()
        self.charts_grid.setSpacing(20)
        self.charts_grid.setColumnStretch(0, 1)
        self.charts_grid.setColumnStretch(1, 1)
        self.layout.addLayout(self.charts_grid)
        
        # Track chart position for grid placement
        self.chart_row = 0
        self.chart_col = 0

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
        
        # Clear charts grid
        while self.charts_grid.count():
            item = self.charts_grid.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        
        # Reset grid position
        self.chart_row = 0
        self.chart_col = 0

    def add_chart_to_grid(self, chart: ChartWidget):
        """Add a chart to the 2-column grid layout."""
        self.charts_grid.addWidget(chart, self.chart_row, self.chart_col)
        self.chart_col += 1
        if self.chart_col >= 2:
            self.chart_col = 0
            self.chart_row += 1

    def display_results(self, data: dict):
        """Display analysis results from API response."""
        self.clear_charts()
        
        # Handle both direct summary and nested summary
        summary = data.get("summary", data)
        
        # Update description
        filename = data.get("filename", "")
        if filename:
            self.description.setText(f"Analysis complete • {filename}")
        else:
            self.description.setText("Analysis complete")

        # Stats cards - use safe .get() with defaults
        stats = [
            ("Total Equipment", str(summary.get("total_equipment", 0)), "🔧"),
            ("Avg Flowrate", f"{summary.get('avg_flowrate', 0):.2f}", "💨"),
            ("Avg Pressure", f"{summary.get('avg_pressure', 0):.2f}", "⚡"),
            ("Avg Temperature", f"{summary.get('avg_temperature', 0):.2f}°", "🌡️"),
        ]

        for i, (title, value, icon) in enumerate(stats):
            card = StatCard(title, value, icon)
            self.stats_grid.addWidget(card, 0, i)

        # Type distribution charts in 2-column grid
        type_dist = summary.get("type_distribution", {})
        type_metrics = summary.get("type_metrics", {})
        
        if type_dist:
            # Row 1: Bar chart + Pie chart
            bar_chart = ChartWidget("Equipment Type Distribution")
            bar_chart.plot_bar(type_dist, xlabel="Type", ylabel="Count")
            self.add_chart_to_grid(bar_chart)

            pie_chart = ChartWidget("Type Distribution (Percentage)")
            pie_chart.plot_pie(type_dist)
            self.add_chart_to_grid(pie_chart)
            
            # Row 2: Grouped bar + Horizontal bar
            if type_metrics:
                grouped_chart = ChartWidget("Metrics by Equipment Type")
                grouped_chart.plot_grouped_bar(type_metrics)
                self.add_chart_to_grid(grouped_chart)
            
            ranking_chart = ChartWidget("Equipment Ranking")
            ranking_chart.plot_horizontal_bar(type_dist)
            self.add_chart_to_grid(ranking_chart)
        else:
            # If no type distribution, show a message
            no_data_label = QLabel("No equipment type data available")
            no_data_label.setObjectName("pageDescription")
            self.charts_grid.addWidget(no_data_label, 0, 0, 1, 2)

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

        # Type distribution in 2-column grid
        type_dist = dataset.get("type_distribution", {})
        type_metrics = dataset.get("type_metrics", {})
        
        # Generate type_metrics if not provided
        if type_dist and not type_metrics:
            type_metrics = {}
            for eq_type, count in type_dist.items():
                type_metrics[eq_type] = {
                    "count": count,
                    "avg_flowrate": dataset.get("avg_flowrate", 0),
                    "avg_pressure": dataset.get("avg_pressure", 0),
                    "avg_temperature": dataset.get("avg_temperature", 0),
                }
        
        if type_dist:
            # Row 1: Bar chart + Pie chart
            bar_chart = ChartWidget("Equipment Type Distribution")
            bar_chart.plot_bar(type_dist, xlabel="Type", ylabel="Count")
            self.add_chart_to_grid(bar_chart)

            pie_chart = ChartWidget("Type Distribution (Percentage)")
            pie_chart.plot_pie(type_dist)
            self.add_chart_to_grid(pie_chart)
            
            # Row 2: Grouped bar + Horizontal bar
            if type_metrics:
                grouped_chart = ChartWidget("Metrics by Equipment Type")
                grouped_chart.plot_grouped_bar(type_metrics)
                self.add_chart_to_grid(grouped_chart)
            
            ranking_chart = ChartWidget("Equipment Ranking")
            ranking_chart.plot_horizontal_bar(type_dist)
            self.add_chart_to_grid(ranking_chart)
