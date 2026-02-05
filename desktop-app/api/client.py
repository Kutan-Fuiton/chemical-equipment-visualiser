"""
API Client for Chemical Equipment Visualizer Backend
Handles authentication and all API calls to Django backend.
"""

import os
import requests
from config import API_BASE_URL, AUTH_TOKEN_FILE


class APIClient:
    """Handles all communication with the Django REST backend."""

    def __init__(self):
        self.base_url = API_BASE_URL
        self.token = self._load_token()

    def _load_token(self) -> str | None:
        """Load auth token from file if exists."""
        if os.path.exists(AUTH_TOKEN_FILE):
            with open(AUTH_TOKEN_FILE, "r") as f:
                return f.read().strip()
        return None

    def _save_token(self, token: str):
        """Save auth token to file."""
        with open(AUTH_TOKEN_FILE, "w") as f:
            f.write(token)
        self.token = token

    def _clear_token(self):
        """Clear stored auth token."""
        if os.path.exists(AUTH_TOKEN_FILE):
            os.remove(AUTH_TOKEN_FILE)
        self.token = None

    def _get_headers(self) -> dict:
        """Get headers with auth token if available."""
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Token {self.token}"
        return headers

    def is_authenticated(self) -> bool:
        """Check if user has a stored token."""
        return self.token is not None

    def login(self, username: str, password: str) -> tuple[bool, str]:
        """
        Authenticate user with username and password.
        Returns (success, message).
        """
        try:
            response = requests.post(
                f"{self.base_url}/api/auth/token/login/",
                json={"username": username, "password": password},
                headers={"Content-Type": "application/json"},
            )

            if response.status_code == 200:
                data = response.json()
                self._save_token(data["auth_token"])
                return True, "Login successful"
            else:
                error = response.json().get("non_field_errors", ["Invalid credentials"])
                return False, error[0] if isinstance(error, list) else str(error)

        except requests.exceptions.ConnectionError:
            return False, "Cannot connect to server. Is the backend running?"
        except Exception as e:
            return False, f"Error: {str(e)}"

    def logout(self) -> tuple[bool, str]:
        """Logout and clear stored token."""
        try:
            if self.token:
                requests.post(
                    f"{self.base_url}/api/auth/token/logout/",
                    headers=self._get_headers(),
                )
            self._clear_token()
            return True, "Logged out successfully"
        except Exception as e:
            self._clear_token()
            return True, "Logged out (offline mode)"

    def upload_csv(self, file_path: str) -> tuple[bool, dict | str]:
        """
        Upload a CSV file for analysis.
        Returns (success, data/error_message).
        """
        try:
            with open(file_path, "rb") as f:
                files = {"file": (os.path.basename(file_path), f, "text/csv")}
                headers = {"Authorization": f"Token {self.token}"}

                response = requests.post(
                    f"{self.base_url}/api/upload/",
                    files=files,
                    headers=headers,
                )

            if response.status_code == 201:
                return True, response.json()
            else:
                error = response.json().get("error", "Upload failed")
                return False, error

        except requests.exceptions.ConnectionError:
            return False, "Cannot connect to server"
        except Exception as e:
            return False, f"Error: {str(e)}"

    def get_history(self) -> tuple[bool, list | str]:
        """
        Get history of last 5 uploaded datasets.
        Returns (success, data/error_message).
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/history/",
                headers=self._get_headers(),
            )

            if response.status_code == 200:
                return True, response.json()
            else:
                return False, "Failed to fetch history"

        except requests.exceptions.ConnectionError:
            return False, "Cannot connect to server"
        except Exception as e:
            return False, f"Error: {str(e)}"

    def download_report(self, dataset_id: int, save_path: str) -> tuple[bool, str]:
        """
        Download PDF report for a dataset.
        Returns (success, message).
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/report/{dataset_id}/",
                headers=self._get_headers(),
                stream=True,
            )

            if response.status_code == 200:
                with open(save_path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return True, f"Report saved to {save_path}"
            else:
                return False, "Failed to download report"

        except requests.exceptions.ConnectionError:
            return False, "Cannot connect to server"
        except Exception as e:
            return False, f"Error: {str(e)}"


# Global API client instance
api_client = APIClient()
