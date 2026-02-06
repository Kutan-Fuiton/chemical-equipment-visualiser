# Chemical Equipment Visualizer

A full‑stack data ingestion and visualization system for chemical equipment datasets. The platform allows authenticated users to upload CSV files, generate analytical summaries, visualize trends using charts, and download PDF reports.

> **Note**: This project includes a fully functional **Backend (Django + DRF)**, **Web Frontend (React + TypeScript + Vite)**, and **Desktop Application (PyQt6)**.

---

## 🏗️ Architecture

```
                    ╔══════════════════════════════════════════════════════════╗
                    ║          CHEMICAL EQUIPMENT VISUALIZER                   ║
                    ╚══════════════════════════════════════════════════════════╝

    ┌───────────────────────────────────────────────────────────────────────────┐
    │                              CLIENTS                                      │
    │                                                                           │
    │   ┌───────────────────┐                      ┌───────────────────┐        │
    │   │   WEB FRONTEND    │                      │   DESKTOP APP     │        │
    │   │   React + Vite    │                      │     PyQt6         │        │
    │   ├───────────────────┤                      ├───────────────────┤        │
    │   │ • Login Page      │                      │ • Login Screen    │        │
    │   │ • CSV Upload      │                      │ • CSV Upload      │        │
    │   │ • Chart.js Viz    │                      │ • Matplotlib Viz  │        │
    │   │ • History View    │                      │ • History View    │        │
    │   │ • PDF Download    │                      │ • PDF Download    │        │
    │   └─────────┬─────────┘                      └─────────┬─────────┘        │
    │             │                                          │                  │
    └─────────────┼──────────────────────────────────────────┼──────────────────┘
                  │                                          │
                  │         ┌────────────────────┐           │
                  └────────►│    HTTP / REST     │◄──────────┘
                            │   (JSON API)       │
                            └─────────┬──────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              SERVER                                      │
    │                                                                          │
    │   ┌───────────────────────────────────────────────────────────────┐     │
    │   │                        BACKEND                                 │     │
    │   │                      Django + DRF                              │     │
    │   ├───────────────────────────────────────────────────────────────┤     │
    │   │  • REST API Endpoints    • Token Authentication               │     │
    │   │  • CSV Parser (Pandas)   • Data Analysis & Statistics         │     │
    │   │  • PDF Generator         • User Management                    │     │
    │   └───────────────────────────────┬───────────────────────────────┘     │
    │                                   │                                      │
    │                                   ▼                                      │
    │                      ┌───────────────────────┐                          │
    │                      │       DATABASE        │                          │
    │                      │       (SQLite)        │                          │
    │                      ├───────────────────────┤                          │
    │                      │  • Users & Tokens     │                          │
    │                      │  • Datasets           │                          │
    │                      │  • Upload History     │                          │
    │                      └───────────────────────┘                          │
    │                                                                          │
    └──────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   USER   │─────▶│    LOGIN     │─────▶│  UPLOAD CSV  │─────▶│ PARSE & SAVE │
└──────────┘      │   (Token)    │      │   (Validate) │      │  (Pandas)    │
                  └──────────────┘      └──────────────┘      └──────┬───────┘
                                                                     │
        ┌────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  STORE DATA  │─────▶│ API RESPONSE │─────▶│  FETCH DATA  │─────▶│ VIEW CHARTS  │
│  (Database)  │      │    (JSON)    │      │   (Axios)    │      │ (Interactive)│
└──────────────┘      └──────────────┘      └──────────────┘      └──────┬───────┘
                                                                         │
                                                                         ▼
                                                              ┌──────────────────┐
                                                              │  DOWNLOAD PDF    │
                                                              │ (ReportLab)      │
                                                              └──────────────────┘
```

---

## 🚀 Features

### Backend
- User authentication (Token‑based using **Djoser**)
- **User-isolated data** - each user has their own upload history
- Secure CSV upload endpoint
- Automatic dataset analysis on upload
- Summary statistics stored in database
- History of last 5 uploaded datasets per user
- PDF report generation with embedded charts
- Protected APIs with authentication

### Frontend – Web
- Login page (with demo credentials option)
- Protected routes (upload & history)
- CSV upload via drag & drop or file picker
- Demo CSV upload
- Interactive charts using **Chart.js** (Bar, Doughnut, Grouped Bar, Horizontal Bar, Radar, Polar Area)
- Dataset history view with expand/collapse
- PDF download button on each history item
- Clean, modern dark UI

### Desktop App
- Login screen with demo credentials
- CSV upload via drag & drop or click-to-browse
- Demo dataset upload
- Interactive charts using **Matplotlib** (Bar, Pie, Grouped Bar, Horizontal Bar)
- 2-column grid layout for charts
- Dataset history view
- PDF report download
- Modern dark theme matching web frontend

---

## 🧱 Tech Stack

### Backend
- Python 3
- Django
- Django REST Framework
- Djoser (Authentication)
- ReportLab (PDF generation)
- Matplotlib (Charts in PDF)
- Pandas (CSV processing)
- SQLite (development)

### Web Frontend
- React + TypeScript
- Vite
- Axios
- Chart.js
- Custom CSS (dark theme)

### Desktop App
- Python 3
- PyQt6
- Matplotlib
- Requests (API client)

---

## 📂 Project Structure

```
chemical-equipment-visualizer/
├── backend/
│   ├── config/           # Django settings & URLs
│   ├── equipment/        # Core app (models, views, services)
│   ├── sample_data/      # Sample CSV files
│   └── manage.py
│
├── web-frontend/
│   ├── public/demo/      # Demo CSV for frontend
│   └── src/
│       ├── api/          # Axios configuration
│       ├── auth/         # Login page
│       ├── charts/       # Chart.js configuration
│       ├── components/   # Navbar, ProtectedRoute, Charts
│       └── pages/        # Upload & History pages
│
├── desktop-app/
│   ├── api/              # API client
│   ├── assets/           # Stylesheets
│   ├── ui/               # PyQt6 pages & widgets
│   └── main.py           # Entry point
│
└── README.md
```

---

## 🔐 Authentication Flow

- Login using username & password
- Backend returns auth token
- Token stored in `localStorage` (web) or `.auth_token` file (desktop)
- Token attached to all API requests
- Protected routes redirect unauthenticated users to login
- **User isolation**: Each user sees only their own datasets

### Demo Credentials

| User   | Username | Password     |
|--------|----------|-------------|
| User 1 | test1    | admin.test1  |
| User 2 | test2    | admin.test2  |
| User 3 | test3    | admin@test3  |

---

## 📊 Data Flow (CSV Upload)

1. User uploads CSV (or uses demo dataset)
2. Backend validates CSV columns
3. Data is parsed and analysed (Pandas)
4. Summary statistics computed (total, averages, distribution)
5. Results saved to database (linked to user)
6. Frontend/Desktop fetches latest summary
7. Charts rendered dynamically

---

## 📄 PDF Report Generation

- Each uploaded dataset can generate a PDF report
- Report includes:
  - Summary statistics with styled boxes
  - Embedded charts (Bar, Pie, Metrics comparison)
  - Professional formatting with colors & accents
- Protected endpoint (auth required)
- Only accessible for user's own datasets

---

## ▶️ Running the Project

### Backend
```bash
cd backend
python -m venv env
env\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Web Frontend
```bash
cd web-frontend
npm install
npm run dev
```

### Desktop App
```bash
cd desktop-app
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**URLs:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

---

## 🧪 Demo Dataset

A demo CSV is provided for testing:

```
backend/sample_data/sample_equipment_data.csv
web-frontend/public/demo/sample_equipment_data.csv
```

The **Use Demo Dataset** button loads and uploads this file.

---

## 🛡 Security Measures

- Token‑based authentication
- Protected backend APIs
- User-isolated data (each user sees only their data)
- CORS configured
- File type validation (CSV only)

---

## 📌 Future Improvements

- Advanced analytics & filters
- Role‑based permissions (Admin/User)
- Cloud storage for uploads
- Dockerization
- Export to Excel/PNG

---

## 👤 Author

**Subarno Chakraborty**

---

## 📜 License

This project is developed as part of the **FOSSEE Internship Programme** for academic and learning purposes.

The source code is intended **only for educational, research, and evaluation use**.  
Commercial use, redistribution, or deployment in production systems is **not permitted** without prior permission from the project authors or FOSSEE.

© 2026 — Developed for FOSSEE Internship
