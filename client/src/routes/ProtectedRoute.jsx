// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ allowedRoles }) => {
//   const { isAuthenticated, user } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;



// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { ROLE_HOME } from "./RoleRedirect";

// const ProtectedRoute = ({ allowedRoles }) => {
//     const { isAuthenticated, user } = useAuth();
//     const location = useLocation();

//     alert(JSON.stringify(user));

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace state={{ from: location }} />;
//     }

//     if (allowedRoles && !allowedRoles.includes(user?.role)) {
//         return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
//     }

//     return <Outlet />;
// };

// export default ProtectedRoute;


import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_HOME } from "./RoleRedirect";

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;