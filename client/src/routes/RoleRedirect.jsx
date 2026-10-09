import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// single source of truth: role -> home page
export const ROLE_HOME = {
    // super_admin: "/super-admin/dashboard",
    super_admin: "/dashboard",
    executive: "/executive/dashboard",
};

const RoleRedirect = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return <Navigate to={ROLE_HOME[user?.role] || "/not-found"} replace />;
};

export default RoleRedirect;
