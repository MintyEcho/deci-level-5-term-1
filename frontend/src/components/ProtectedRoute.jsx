import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
