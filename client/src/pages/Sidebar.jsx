import clsx from "clsx";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FileText,
    ScanLine,
    Users,
    CreditCard,
    Settings,
    ChevronRight,
    X,
    LogOut,
    UserPlus,
} from "lucide-react";

const navItems = [
    // { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
    // { icon: UserPlus, label: "Add-Executive", to: "/add-executive" },
    { icon: ScanLine, label: "Scans", to: "/scans" },
    { icon: Users, label: "Team", to: "/team" },
    { icon: CreditCard, label: "Billing", to: "/billing" },
    { icon: Settings, label: "Settings", to: "/settings" },
];

const Sidebar = ({ open, onClose, onLogout, user }) => (
    <>
        {/* Mobile overlay */}
        {open && (
            <div
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                onClick={onClose}
            />
        )}

        <aside
            className={clsx(
                "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0",
                open ? "translate-x-0" : "-translate-x-full",
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white shadow-sm">
                        <ScanLine className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">
                        OCR
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-900 lg:hidden"
                    aria-label="Close sidebar"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navItems.map(({ icon: Icon, label, badge, to }) => (
                    <NavLink
                        key={label}
                        to={to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            clsx(
                                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                                isActive
                                    ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className="h-4 w-4" />
                                <span>{label}</span>

                                {badge && (
                                    <span
                                        className={clsx(
                                            "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                            isActive
                                                ? "bg-red-100 text-red-600"
                                                : "bg-slate-100 text-slate-600",
                                        )}
                                    >
                                        {badge}
                                    </span>
                                )}

                                {isActive && !badge && (
                                    <ChevronRight className="ml-auto h-4 w-4" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="border-t border-slate-200 p-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-xs font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-900">
                            {user?.name || "User"}
                        </p>
                        <p className="truncate text-[10px] capitalize text-slate-500">
                            {user?.role?.replace("_", " ") || "Member"}
                        </p>
                    </div>

                    <button
                        onClick={onLogout}
                        title="Logout"
                        aria-label="Logout"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    </>
);

export default Sidebar;
