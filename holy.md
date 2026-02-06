# Chemical Equipment Visualizer

A full‑stack data ingestion and visualization system for chemical equipment datasets. The platform allows authenticated users to upload CSV files, generate analytical summaries, visualize trends using charts, and download PDF reports.

> **Note**: The desktop application part was planned but not completed. This repository currently includes a fully functional **backend (Django + DRF)** and **web frontend (React + TypeScript + Vite)**.

---

## 🚀 Features

### Backend (Completed)
- User authentication (Token‑based using **Djoser**)
- Secure CSV upload endpoint
- Automatic dataset analysis on upload
- Summary statistics stored in database
- History of last 5 uploaded datasets
- PDF report generation
- Protected APIs with authentication

### Frontend – Web (Completed)
- Login page (with demo credentials option)
- Protected routes (upload & history)
- CSV upload via drag & drop or file picker
- Demo CSV upload (no backend API required)
- Interactive charts using **Chart.js**
- Dataset history view
- PDF download support
- Clean, modern UI (Tailwind CSS + custom styles)

### Desktop App (❌ Not Completed)
- Desktop application using PyQt / Electron was planned
- Not implemented due to time constraints

---

## 🧱 Tech Stack

### Backend
- Python 3
- Django
- Django REST Framework
- Djoser (Authentication)
- ReportLab (PDF generation)
- SQLite (development)

### Frontend
- React + TypeScript
- Vite
- Axios
- Tailwind CSS
- Chart.js

---

## 📂 Project Structure

```
chemical-equipment-visualizer/
├── backend/
│   ├── equipment/        # Core app (models, views, services)
│   ├── sample_data/      # Sample CSV files
│   ├── media/            # Uploaded files
│   └── manage.py
│
├── web-frontend/
│   ├── public/demo/      # Demo CSV for frontend
│   └── src/
│       ├── api/          # Axios configuration
│       ├── auth/         # Login page
│       ├── charts/       # Chart configs
│       ├── components/   # Navbar, ProtectedRoute, Charts
│       └── pages/        # Upload & History pages
│
└── README.md
```

---

## 🔐 Authentication Flow

- Login using username & password
- Backend returns auth token
- Token stored in `localStorage`
- Axios interceptor attaches token to all requests
- Protected routes redirect unauthenticated users to `/login`

Demo credentials can be used directly from the login page.

---

## 📊 Data Flow (CSV Upload)

1. User uploads CSV (or uses demo dataset)
2. Backend validates CSV
3. Data is parsed and analysed
4. Summary statistics are saved
5. Frontend fetches latest summary
6. Charts are rendered dynamically

---

## 📄 PDF Report Generation

- Each uploaded dataset can generate a PDF report
- Report includes summary statistics
- Protected endpoint (auth required)
- Frontend downloads PDF using auth token

---

## ▶️ Running the Project

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd web-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:8000`

---

## 🧪 Demo Dataset

A demo CSV is provided for testing:

```
web-frontend/public/demo/sample_equipment_data.csv
```

The **Use Demo Dataset** button loads and uploads this file directly.

---

## 🛡 Security Measures

- Token‑based authentication
- Protected backend APIs
- CORS configured
- File type validation (CSV only)

---

## ❗ Limitations

- Desktop application not implemented
- No role‑based access control
- SQLite used for development only

---

## 📌 Future Improvements

- Desktop application support
- Advanced analytics & filters
- Role‑based permissions
- Cloud storage for uploads
- Dockerization

---

## 👤 Author

**Subarno Chakraborty**

---

## 📜 License

This project is developed as part of the **FOSSEE Internship Programme** for academic and learning purposes.

The source code is intended **only for educational, research, and evaluation use**.  
Commercial use, redistribution, or deployment in production systems is **not permitted** without prior permission from the project authors or FOSSEE.

© 2026 — Developed for FOSSEE Internship


