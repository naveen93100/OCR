import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../pages/Sidebar";
import Header from "./Header";
import { downloadExcel } from "../utils/downloadExcel";

const BASE_URL = import.meta.env.VITE_API_URL;
const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

const clearSession = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
};

const DashboardLayout = () => {
    const user = useMemo(() => getUser(), []);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        try {
            // TODO: call backend logout endpoint here
            clearSession();
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch (err) {
            toast.error("Failed to logout");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Background grid + glow */}
            <div
                className="pointer-events-none fixed inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="pointer-events-none fixed left-1/4 top-0 h-100 w-150 rounded-full bg-red-500/10 blur-[120px]" />
            <div className="pointer-events-none fixed bottom-0 right-0 h-75 w-100 rounded-full bg-rose-500/10 blur-[100px]" />

            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
                user={user}
            />

            <div className="relative lg:pl-64">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}

                    user={user}
                    onDownload={() =>
                        downloadExcel(`${BASE_URL}/api/v1/admin/download-excel`)
                    }
                />

                {/* Page content renders here */}
                <Outlet context={{ user, searchQuery }} />
            </div>
        </div>
    );
};

export default DashboardLayout;
