"""
Upload Page - CSV file upload interface
"""

import os
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel,
    QPushButton, QFrame, QFileDialog, QScrollArea
)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QFont, QDragEnterEvent, QDropEvent

from api import api_client


class DropZone(QFrame):
    """Drag and drop zone for CSV files - also clickable."""
    
    file_dropped = pyqtSignal(str)
    clicked = pyqtSignal()  # Signal for click to browse

    def __init__(self):
        super().__init__()
        self.setAcceptDrops(True)
        self.setObjectName("dropZone")
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        icon = QLabel("📁")
        icon.setFont(QFont("Segoe UI Emoji", 48))
        icon.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(icon)

        text = QLabel("Drag & drop CSV file here")
        text.setObjectName("dropZoneText")
        text.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(text)

        subtext = QLabel("or click anywhere to browse")
        subtext.setObjectName("dropZoneSubtext")
        subtext.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(subtext)

    def mousePressEvent(self, event):
        """Handle click to open file browser."""
        self.clicked.emit()
        super().mousePressEvent(event)

    def dragEnterEvent(self, event: QDragEnterEvent):
        if event.mimeData().hasUrls():
            url = event.mimeData().urls()[0]
            if url.toLocalFile().endswith('.csv'):
                event.acceptProposedAction()
                self.setProperty("dragOver", True)
                self.style().polish(self)

    def dragLeaveEvent(self, event):
        self.setProperty("dragOver", False)
        self.style().polish(self)

    def dropEvent(self, event: QDropEvent):
        self.setProperty("dragOver", False)
        self.style().polish(self)
        
        url = event.mimeData().urls()[0]
        file_path = url.toLocalFile()
        if file_path.endswith('.csv'):
            self.file_dropped.emit(file_path)


class UploadPage(QWidget):
    """Page for uploading CSV files."""
    
    upload_complete = pyqtSignal(dict)

    def __init__(self):
        super().__init__()
        self.selected_file = None
        self.setup_ui()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(40, 40, 40, 40)
        layout.setSpacing(20)

        # Header
        header = QLabel("Upload Dataset")
        header.setObjectName("pageTitle")
        header.setFont(QFont("Segoe UI", 24, QFont.Weight.Bold))
        layout.addWidget(header)

        description = QLabel("Upload a CSV file containing chemical equipment data for analysis.")
        description.setObjectName("pageDescription")
        description.setWordWrap(True)
        layout.addWidget(description)

        layout.addSpacing(10)

        # Drop zone (also clickable to browse)
        self.drop_zone = DropZone()
        self.drop_zone.setMinimumHeight(200)
        self.drop_zone.file_dropped.connect(self.on_file_selected)
        self.drop_zone.clicked.connect(self.browse_file)
        layout.addWidget(self.drop_zone)

        # Selected file label
        self.file_label = QLabel("No file selected")
        self.file_label.setObjectName("fileLabel")
        self.file_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.file_label)

        # Upload button
        self.upload_btn = QPushButton("Upload & Analyze")
        self.upload_btn.setObjectName("primaryButton")
        self.upload_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.upload_btn.setEnabled(False)
        self.upload_btn.clicked.connect(self.handle_upload)
        layout.addWidget(self.upload_btn)

        # Demo CSV button
        demo_btn = QPushButton("📄 Use Demo Dataset")
        demo_btn.setObjectName("secondaryButton")
        demo_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        demo_btn.clicked.connect(self.use_demo_csv)
        layout.addWidget(demo_btn)

        # Status/Error label
        self.status_label = QLabel("")
        self.status_label.setObjectName("statusLabel")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.status_label.setWordWrap(True)
        self.status_label.hide()
        layout.addWidget(self.status_label)

        # Required columns info
        info_frame = QFrame()
        info_frame.setObjectName("infoCard")
        info_layout = QVBoxLayout(info_frame)
        
        info_title = QLabel("Required CSV Columns:")
        info_title.setObjectName("infoTitle")
        info_layout.addWidget(info_title)

        columns = ["Equipment Name", "Type", "Flowrate", "Pressure", "Temperature"]
        for col in columns:
            col_label = QLabel(f"  • {col}")
            col_label.setObjectName("infoText")
            info_layout.addWidget(col_label)

        layout.addWidget(info_frame)
        layout.addStretch()

    def browse_file(self):
        """Open file dialog to select CSV."""
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select CSV File",
            "",
            "CSV Files (*.csv);;All Files (*)"
        )
        if file_path:
            self.on_file_selected(file_path)

    def on_file_selected(self, file_path: str):
        """Handle file selection."""
        self.selected_file = file_path
        filename = os.path.basename(file_path)
        self.file_label.setText(f"Selected: {filename}")
        self.file_label.setObjectName("fileLabelSelected")
        self.style().polish(self.file_label)
        self.upload_btn.setEnabled(True)
        self.status_label.hide()

    def handle_upload(self):
        """Upload the selected file."""
        if not self.selected_file:
            return

        self.upload_btn.setEnabled(False)
        self.upload_btn.setText("⏳ Uploading & Analyzing...")
        self.status_label.hide()

        success, result = api_client.upload_csv(self.selected_file)

        if success:
            self.status_label.setText("✓ Upload successful! Generating charts...")
            self.status_label.setObjectName("successLabel")
            self.status_label.show()
            self.style().polish(self.status_label)
            # Emit the signal with the result data
            self.upload_complete.emit(result)
        else:
            self.status_label.setText(f"✗ {result}")
            self.status_label.setObjectName("errorLabel")
            self.status_label.show()
            self.upload_btn.setEnabled(True)
            self.upload_btn.setText("Upload & Analyze")

        self.style().polish(self.status_label)

    def use_demo_csv(self):
        """Use the demo CSV file from backend sample_data."""
        # Find the demo CSV file relative to desktop-app directory
        app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        project_dir = os.path.dirname(app_dir)
        demo_csv_path = os.path.join(project_dir, "backend", "sample_data", "sample_equipment_data.csv")
        
        if os.path.exists(demo_csv_path):
            self.on_file_selected(demo_csv_path)
            # Auto-upload the demo file
            self.handle_upload()
        else:
            self.status_label.setText("✗ Demo CSV file not found")
            self.status_label.setObjectName("errorLabel")
            self.status_label.show()
            self.style().polish(self.status_label)

    def reset(self):
        """Reset the upload form."""
        self.selected_file = None
        self.file_label.setText("No file selected")
        self.file_label.setObjectName("fileLabel")
        self.style().polish(self.file_label)
        self.upload_btn.setEnabled(False)
        self.upload_btn.setText("Upload & Analyze")
        self.status_label.hide()
