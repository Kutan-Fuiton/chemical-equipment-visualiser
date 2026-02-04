"""
Chemical Equipment Visualizer - Desktop Application
Main entry point
"""

import sys
import os

# Add app directory to path for imports
app_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, app_dir)

from PyQt6.QtWidgets import QApplication
from PyQt6.QtGui import QIcon

from ui.main_window import MainWindow


def load_stylesheet() -> str:
    """Load the application stylesheet."""
    style_path = os.path.join(app_dir, "assets", "style.qss")
    try:
        with open(style_path, "r") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: Stylesheet not found at {style_path}")
        return ""


def main():
    """Application entry point."""
    # Create application
    app = QApplication(sys.argv)
    app.setApplicationName("ChemViz")
    app.setOrganizationName("FOSSEE")
    
    # Load and apply stylesheet
    stylesheet = load_stylesheet()
    if stylesheet:
        app.setStyleSheet(stylesheet)

    # Create and show main window
    window = MainWindow()
    window.show()

    # Run application
    sys.exit(app.exec())


if __name__ == "__main__":
    main()