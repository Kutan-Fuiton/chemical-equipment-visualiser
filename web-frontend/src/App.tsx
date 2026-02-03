import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login          from "./auth/login";
import Upload         from "./pages/upload";
import History        from "./pages/history";
import Navbar         from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

/* inner wrapper so useLocation works (must be inside BrowserRouter) */
function Layout() {
  const location = useLocation();
  const showNav = location.pathname !== "/login";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "'Rajdhani', sans-serif" }}>
      {showNav && <Navbar />}

      <Routes>
        {/* 🔑 ROOT → LOGIN */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* 🔑 EVERYTHING ELSE → LOGIN */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;