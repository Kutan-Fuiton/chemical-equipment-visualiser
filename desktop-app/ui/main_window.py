"""
Main Window - Application shell with navigation
"""

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QLabel, QPushButton, QStackedWidget, QFrame
)
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont

from api import api_client
from ui.login_page import LoginPage
from ui.upload_page import UploadPage
from ui.charts_page import ChartsPage
from ui.history_page import HistoryPage


class NavButton(QPushButton):
    """Navigation sidebar button."""

    def __init__(self, text: str, icon: str = ""):
        super().__init__(f"{icon}  {text}" if icon else text)
        self.setObjectName("navButton")
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setCheckable(True)


class MainWindow(QMainWindow):
    """Main application window with navigation."""

    def __init__(self):
        super().__init__()
        self.setWindowTitle("ChemViz - Chemical Equipment Visualizer")
        self.setMinimumSize(1200, 800)
        self.setup_ui()
        self.show_login()

    def setup_ui(self):
        """Set up the main UI structure."""
        central = QWidget()
        self.setCentralWidget(central)
        
        main_layout = QHBoxLayout(central)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Sidebar (hidden initially)
        self.sidebar = QFrame()
        self.sidebar.setObjectName("sidebar")
        self.sidebar.setFixedWidth(220)
        self.sidebar.hide()
        
        sidebar_layout = QVBoxLayout(self.sidebar)
        sidebar_layout.setContentsMargins(15, 20, 15, 20)
        sidebar_layout.setSpacing(10)

        # App title in sidebar
        app_title = QLabel("ChemViz")
        app_title.setObjectName("sidebarTitle")
        app_title.setFont(QFont("Segoe UI", 18, QFont.Weight.Bold))
        sidebar_layout.addWidget(app_title)
        
        app_subtitle = QLabel("Chemical Equipment\nVisualizer")
        app_subtitle.setObjectName("sidebarSubtitle")
        sidebar_layout.addWidget(app_subtitle)
        
        sidebar_layout.addSpacing(30)

        # Navigation buttons
        self.nav_upload = NavButton("Upload", "📤")
        self.nav_upload.clicked.connect(lambda: self.switch_page(0))
        sidebar_layout.addWidget(self.nav_upload)

        self.nav_charts = NavButton("Charts", "📊")
        self.nav_charts.clicked.connect(lambda: self.switch_page(1))
        sidebar_layout.addWidget(self.nav_charts)

        self.nav_history = NavButton("History", "📁")
        self.nav_history.clicked.connect(lambda: self.switch_page(2))
        sidebar_layout.addWidget(self.nav_history)

        sidebar_layout.addStretch()

        # Logout button
        logout_btn = QPushButton("🚪  Logout")
        logout_btn.setObjectName("logoutButton")
        logout_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        logout_btn.clicked.connect(self.handle_logout)
        sidebar_layout.addWidget(logout_btn)

        main_layout.addWidget(self.sidebar)

        # Content area
        content = QFrame()
        content.setObjectName("content")
        content_layout = QVBoxLayout(content)
        content_layout.setContentsMargins(0, 0, 0, 0)

        # Stacked widget for pages
        self.stack = QStackedWidget()
        
        # Login page
        self.login_page = LoginPage()
        self.login_page.login_successful.connect(self.on_login_success)
        self.stack.addWidget(self.login_page)

        # App pages
        self.upload_page = UploadPage()
        self.upload_page.upload_complete.connect(self.on_upload_complete)
        self.stack.addWidget(self.upload_page)

        self.charts_page = ChartsPage()
        self.stack.addWidget(self.charts_page)

        self.history_page = HistoryPage()
        self.history_page.view_dataset.connect(self.on_view_from_history)
        self.stack.addWidget(self.history_page)

        content_layout.addWidget(self.stack)
        main_layout.addWidget(content, 1)

        self.nav_buttons = [self.nav_upload, self.nav_charts, self.nav_history]

    def show_login(self):
        """Show login page and hide sidebar."""
        self.sidebar.hide()
        self.stack.setCurrentWidget(self.login_page)
        self.login_page.clear_form()

    def on_login_success(self):
        """Handle successful login."""
        self.sidebar.show()
        self.switch_page(0)  # Go to upload page

    def switch_page(self, index: int):
        """Switch to a specific page (0=upload, 1=charts, 2=history)."""
        # Update nav button states
        for i, btn in enumerate(self.nav_buttons):
            btn.setChecked(i == index)

        # Switch page (offset by 1 because login is index 0)
        self.stack.setCurrentIndex(index + 1)

        # Refresh history when switching to it
        if index == 2:
            self.history_page.load_history()

    def on_upload_complete(self, data: dict):
        """Handle successful upload - show charts."""
        self.charts_page.display_results(data)
        self.switch_page(1)  # Switch to charts

    def on_view_from_history(self, dataset: dict):
        """View charts from history dataset."""
        self.charts_page.display_from_history(dataset)
        self.switch_page(1)  # Switch to charts

    def handle_logout(self):
        """Handle logout button click."""
        api_client.logout()
        self.show_login()
