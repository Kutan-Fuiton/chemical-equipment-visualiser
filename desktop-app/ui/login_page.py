"""
Login Page - User authentication interface
"""

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
    QLineEdit, QPushButton, QFrame, QMessageBox
)
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QFont

from api import api_client


class LoginPage(QWidget):
    """Login page with username/password authentication."""
    
    login_successful = pyqtSignal()

    def __init__(self):
        super().__init__()
        self.setup_ui()

    def setup_ui(self):
        """Set up the login form UI."""
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)

        # Container card
        card = QFrame()
        card.setObjectName("loginCard")
        card.setFixedWidth(400)
        card_layout = QVBoxLayout(card)
        card_layout.setSpacing(20)
        card_layout.setContentsMargins(40, 40, 40, 40)

        # Title
        title = QLabel("ChemViz")
        title.setObjectName("loginTitle")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title.setFont(QFont("Segoe UI", 24, QFont.Weight.Bold))
        card_layout.addWidget(title)

        # Subtitle
        subtitle = QLabel("Chemical Equipment Visualizer")
        subtitle.setObjectName("loginSubtitle")
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        card_layout.addWidget(subtitle)

        card_layout.addSpacing(20)

        # Username field
        username_label = QLabel("Username")
        username_label.setObjectName("fieldLabel")
        card_layout.addWidget(username_label)
        
        self.username_input = QLineEdit()
        self.username_input.setPlaceholderText("Enter your username")
        self.username_input.setObjectName("inputField")
        card_layout.addWidget(self.username_input)

        # Password field
        password_label = QLabel("Password")
        password_label.setObjectName("fieldLabel")
        card_layout.addWidget(password_label)
        
        self.password_input = QLineEdit()
        self.password_input.setPlaceholderText("Enter your password")
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)
        self.password_input.setObjectName("inputField")
        self.password_input.returnPressed.connect(self.handle_login)
        card_layout.addWidget(self.password_input)

        card_layout.addSpacing(10)

        # Login button
        self.login_btn = QPushButton("Sign In")
        self.login_btn.setObjectName("primaryButton")
        self.login_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.login_btn.clicked.connect(self.handle_login)
        card_layout.addWidget(self.login_btn)

        # Demo credentials button
        demo_btn = QPushButton("Use Demo Credentials")
        demo_btn.setObjectName("secondaryButton")
        demo_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        demo_btn.clicked.connect(self.fill_demo_credentials)
        card_layout.addWidget(demo_btn)

        # Error message label
        self.error_label = QLabel("")
        self.error_label.setObjectName("errorLabel")
        self.error_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.error_label.setWordWrap(True)
        self.error_label.hide()
        card_layout.addWidget(self.error_label)

        layout.addWidget(card)

    def handle_login(self):
        """Handle login button click."""
        username = self.username_input.text().strip()
        password = self.password_input.text()

        if not username or not password:
            self.show_error("Please enter both username and password")
            return

        # Disable button during login
        self.login_btn.setEnabled(False)
        self.login_btn.setText("Signing in...")

        # Attempt login
        success, message = api_client.login(username, password)

        if success:
            self.error_label.hide()
            self.login_successful.emit()
        else:
            self.show_error(message)

        # Re-enable button
        self.login_btn.setEnabled(True)
        self.login_btn.setText("Sign In")

    def show_error(self, message: str):
        """Display error message."""
        self.error_label.setText(message)
        self.error_label.show()

    def fill_demo_credentials(self):
        """Fill in demo credentials for testing."""
        self.username_input.setText("Itami214")
        self.password_input.setText("superuser")
        self.error_label.hide()

    def clear_form(self):
        """Clear the form fields."""
        self.username_input.clear()
        self.password_input.clear()
        self.error_label.hide()
