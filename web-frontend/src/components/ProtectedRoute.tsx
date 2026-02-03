import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;