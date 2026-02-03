import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/login";
import Upload from "./pages/upload";
import History from "./pages/history";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
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

        {/* Default route */}
        <Route
          path="*"
          element={<Navigate to="/upload" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
