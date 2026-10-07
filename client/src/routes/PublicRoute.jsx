import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// keeps logged-in users away from /login
const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;