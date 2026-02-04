"""
History Page - View past uploaded datasets
"""

import os
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QPushButton, QFrame, QScrollArea, QFileDialog,
    QMessageBox
)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QFont

from api import api_client


class DatasetCard(QFrame):
    """Card displaying a single dataset from history."""
    
    view_clicked = pyqtSignal(dict)
    download_clicked = pyqtSignal(int)

    def __init__(self, dataset: dict):
        super().__init__()
        self.dataset = dataset
        self.setObjectName("datasetCard")
        self.setup_ui()

    def setup_ui(self):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 15, 20, 15)

        # Info section
        info_layout = QVBoxLayout()
        
        filename = QLabel(self.dataset.get("filename", "Unknown"))
        filename.setObjectName("datasetFilename")
        filename.setFont(QFont("Segoe UI", 12, QFont.Weight.Bold))
        info_layout.addWidget(filename)

        # Upload date
        uploaded = self.dataset.get("uploaded_at", "")
        if uploaded:
            # Format: 2024-01-15T10:30:00Z -> Jan 15, 2024
            try:
                from datetime import datetime
                dt = datetime.fromisoformat(uploaded.replace('Z', '+00:00'))
                formatted = dt.strftime("%b %d, %Y at %H:%M")
            except:
                formatted = uploaded
            date_label = QLabel(f"Uploaded: {formatted}")
            date_label.setObjectName("datasetDate")
            info_layout.addWidget(date_label)

        # Stats row
        stats = f"Equipment: {self.dataset.get('total_equipment', 0)} | " \
                f"Avg Flow: {self.dataset.get('avg_flowrate', 0):.1f} | " \
                f"Avg Pressure: {self.dataset.get('avg_pressure', 0):.1f}"
        stats_label = QLabel(stats)
        stats_label.setObjectName("datasetStats")
        info_layout.addWidget(stats_label)

        layout.addLayout(info_layout, 1)

        # Buttons
        btn_layout = QVBoxLayout()
        btn_layout.setSpacing(8)

        view_btn = QPushButton("View Charts")
        view_btn.setObjectName("secondaryButton")
        view_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        view_btn.clicked.connect(lambda: self.view_clicked.emit(self.dataset))
        btn_layout.addWidget(view_btn)

        download_btn = QPushButton("Download PDF")
        download_btn.setObjectName("outlineButton")
        download_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        download_btn.clicked.connect(lambda: self.download_clicked.emit(self.dataset.get("id")))
        btn_layout.addWidget(download_btn)

        layout.addLayout(btn_layout)


class HistoryPage(QWidget):
    """Page displaying history of uploaded datasets."""
    
    view_dataset = pyqtSignal(dict)

    def __init__(self):
        super().__init__()
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(20)

        # Header row
        header_row = QHBoxLayout()
        
        header = QLabel("Dataset History")
        header.setObjectName("pageTitle")
        header.setFont(QFont("Segoe UI", 24, QFont.Weight.Bold))
        header_row.addWidget(header)
        
        header_row.addStretch()
        
        refresh_btn = QPushButton("Refresh")
        refresh_btn.setObjectName("secondaryButton")
        refresh_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        refresh_btn.clicked.connect(self.load_history)
        header_row.addWidget(refresh_btn)
        
        layout.addLayout(header_row)

        description = QLabel("View your last 5 uploaded datasets and download reports.")
        description.setObjectName("pageDescription")
        layout.addWidget(description)

        # Scroll area for cards
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("historyScroll")
        
        self.cards_container = QWidget()
        self.cards_layout = QVBoxLayout(self.cards_container)
        self.cards_layout.setSpacing(15)
        self.cards_layout.addStretch()
        
        scroll.setWidget(self.cards_container)
        layout.addWidget(scroll, 1)

        # Status label
        self.status_label = QLabel("")
        self.status_label.setObjectName("statusLabel")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.status_label.hide()
        layout.addWidget(self.status_label)

    def load_history(self):
        """Fetch and display dataset history."""
        # Clear existing cards
        while self.cards_layout.count() > 1:  # Keep the stretch
            item = self.cards_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        self.status_label.hide()

        success, result = api_client.get_history()

        if success:
            if not result:
                self.status_label.setText("No datasets uploaded yet.")
                self.status_label.setObjectName("hintLabel")
                self.status_label.show()
            else:
                for dataset in result:
                    card = DatasetCard(dataset)
                    card.view_clicked.connect(self.on_view_dataset)
                    card.download_clicked.connect(self.on_download_pdf)
                    self.cards_layout.insertWidget(
                        self.cards_layout.count() - 1, card
                    )
        else:
            self.status_label.setText(f"Error: {result}")
            self.status_label.setObjectName("errorLabel")
            self.status_label.show()
        
        self.style().polish(self.status_label)

    def on_view_dataset(self, dataset: dict):
        """Handle view charts button click."""
        self.view_dataset.emit(dataset)

    def on_download_pdf(self, dataset_id: int):
        """Handle download PDF button click."""
        if not dataset_id:
            return

        # Get save location
        save_path, _ = QFileDialog.getSaveFileName(
            self,
            "Save PDF Report",
            f"dataset_report_{dataset_id}.pdf",
            "PDF Files (*.pdf)"
        )

        if not save_path:
            return

        success, message = api_client.download_report(dataset_id, save_path)

        if success:
            QMessageBox.information(
                self, "Success", 
                f"Report saved to:\n{save_path}"
            )
        else:
            QMessageBox.warning(
                self, "Error",
                f"Failed to download report:\n{message}"
            )
