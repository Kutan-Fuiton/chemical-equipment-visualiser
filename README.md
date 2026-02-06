# 🧪 Chemical Equipment Visualizer

![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-4.2-green?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react&logoColor=white)
![PyQt6](https://img.shields.io/badge/PyQt6-GUI-orange)
![License](https://img.shields.io/badge/License-Educational-yellow)

A high-performance, hybrid analytics system designed for chemical engineers to visualize and process equipment parameter data. Features a `Django REST API`, an interactive `React Dashboard`, and a native `PyQt6 Desktop Application`.

---

## 🏗️ System Architecture

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

---

## 🚀 Features

| Component | Key Features |
|-----------|-------------|
| **🔧 Backend** | Token auth (Djoser) • CSV parsing (Pandas) • PDF generation (ReportLab) • User-isolated data |
| **🌐 Web Frontend** | Chart.js visualizations • Drag-drop upload • History view • Dark theme |
| **🖥️ Desktop App** | Matplotlib charts • 2-column grid layout • PDF download • Dark theme |

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | `Python` `Django` `DRF` `Djoser` `ReportLab` `Pandas` `SQLite` |
| **Web** | `React` `TypeScript` `Vite` `Axios` `Chart.js` |
| **Desktop** | `Python` `PyQt6` `Matplotlib` `Requests` |

---

## 🔐 Demo Credentials

| Username | Password |
|----------|----------|
| `test1` | `admin.test1` |
| `test2` | `admin.test2` |
| `test3` | `admin@test3` |

---

## ▶️ Quick Start

### 🔧 Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 🌐 Web Frontend
```bash
cd web-frontend
npm install && npm run dev
```

### 🖥️ Desktop App
```bash
cd desktop-app
pip install -r requirements.txt
python main.py
```

**📍 URLs:** Frontend `http://localhost:5173` • Backend `http://localhost:8000`

---

## 👤 Author

**Subarno Chakraborty**

---

## 📜 License

Developed as part of the **FOSSEE Internship Programme** for educational purposes only.

© 2026 — Developed for FOSSEE Internship
