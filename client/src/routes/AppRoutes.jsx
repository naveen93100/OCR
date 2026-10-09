// import { Navigate, Route, Routes } from "react-router-dom";
// import Login from "../pages/Login";
// import ExecutiveDashboard from "../pages/ExecutiveDashboard";
// import Dashboard from "../pages/Dashboard";

// const Home = () => {
//     const user = getUser();
//     return (
//         <Navigate
//             to={user ? ROLE_HOME[user.role] || "/login" : "/login"}
//             replace
//         />
//     );
// };

// const AppRoutes = () => (
//     <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/executive" element={<ExecutiveDashboard />} />
//         <Route path="/admin" element={<Dashboard />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
// );

// export default AppRoutes;


import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import ExecutiveDashboard from "../pages/ExecutiveDashboard";
import Dashboard from "../pages/Dashboard";

const ROLE_HOME = {
    executive: "/executive",
    super_admin: "/admin",
};

const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

const Home = () => {
    const user = getUser();
    const role = String(user?.role || "").toLowerCase();
    return <Navigate to={ROLE_HOME[role] || "/login"} replace />;
};

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/executive" element={<ExecutiveDashboard />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;