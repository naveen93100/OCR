// import { Navigate, Route, Routes } from "react-router-dom";
// import Login from "../pages/Login";
// import ExecutiveDashboard from "../pages/ExecutiveDashboard";
// import Dashboard from "../pages/Dashboard";
// import AddExecutive from "../pages/superAdmin/AddExecutive";
// import DashboardLayout from "../components/DashboardLayout";

// const ROLE_HOME = {
//     executive: "/executive",
//     super_admin: "/admin",
// };

// const getUser = () => {
//     try {
//         return JSON.parse(localStorage.getItem("user"));
//     } catch {
//         return null;
//     }
// };

// const Home = () => {
//     const user = getUser();
//     const role = String(user?.role || "").toLowerCase();
//     return <Navigate to={ROLE_HOME[role] || "/login"} replace />;
// };

// const AppRoutes = () => (
//     <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/executive" element={<ExecutiveDashboard />} />
//         <Route path="/admin" element={<Dashboard />} />
//         <Route path="/addexecutive" element={<AddExecutive />} />

//         <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
// );

// export default AppRoutes;

import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import ExecutiveDashboard from "../pages/ExecutiveDashboard";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../components/DashboardLayout";
import AllLeads from "../pages/superAdmin/AllLeads";
import ShowExecutiveList from "../pages/superAdmin/ShowExecutiveList";
import ExecDashboard from "../pages/Executive/ExecDashboard";
import History from "../pages/Executive/History";
import Pending from "../pages/Executive/Pending";
import Verified from "../pages/Executive/Verified";
import Unverified from '../pages/Executive/Unverified'
import Rejected from "../pages/Executive/Rejected";

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

const getRole = () => String(getUser()?.role || "").toLowerCase();
const getToken = () => localStorage.getItem("access_token");

const Home = () => <Navigate to={ROLE_HOME[getRole()] || "/login"} replace />;

// Only logged-in users with an allowed role can enter
const ProtectedRoute = ({ allowedRoles, children }) => {
    const role = getRole();

    if (!getToken() || !ROLE_HOME[role]) {
        return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(role)) {
        return <Navigate to={ROLE_HOME[role]} replace />;
    }
    return children;
};

// Logged-in users shouldn't see the login page again
const PublicRoute = ({ children }) => {
    const role = getRole();

    if (getToken() && ROLE_HOME[role]) {
        return <Navigate to={ROLE_HOME[role]} replace />;
    }
    return children;
};

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />

        <Route
            path="/login"
            element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            }
        />

        <Route
            path="/executive"
            element={
                <ProtectedRoute allowedRoles={["executive"]} >
                    <ExecutiveDashboard />
                </ProtectedRoute>
            }
        >

           <Route path="" element={<ExecDashboard/>}/>
           <Route path="pending" element={<Pending/>}/>
           <Route path="un-verified" element={<Unverified/>}/>
           <Route path="verified" element={<Verified/>}/>
           <Route path="rejected" element={<Rejected/>}/>
        </Route>


        {/* Super admin pages share Sidebar + Header via DashboardLayout */}
        <Route
            element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                    <DashboardLayout />
                </ProtectedRoute>
            }
        >
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/all-leads" element={<AllLeads />} />
            <Route path="/team" element={<ShowExecutiveList />} />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default AppRoutes;
