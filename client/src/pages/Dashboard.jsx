// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     LogOut,
//     ScanLine,
//     LayoutDashboard,
//     FileText,
//     Settings,
//     Users,
//     Bell,
//     Search,
//     Menu,
//     X,
//     TrendingUp,
//     TrendingDown,
//     Clock,
//     CheckCircle2,
//     XCircle,
//     Download,
//     Eye,
//     Trash2,
//     Zap,
//     CreditCard,
//     ChevronRight,
//     Calendar,
//     Filter,
//     Plus,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import clsx from "clsx";

// /* ---------- Dummy Data ---------- */
// const stats = [
//     {
//         label: "Total Scans",
//         value: "12,847",
//         change: "+12.5%",
//         trend: "up",
//         icon: ScanLine,
//         color: "cyan",
//     },
//     {
//         label: "Documents",
//         value: "3,429",
//         change: "+8.2%",
//         trend: "up",
//         icon: FileText,
//         color: "purple",
//     },
//     {
//         label: "Processing",
//         value: "24",
//         change: "-3.1%",
//         trend: "down",
//         icon: Clock,
//         color: "amber",
//     },
//     {
//         label: "Accuracy",
//         value: "99.2%",
//         change: "+0.4%",
//         trend: "up",
//         icon: CheckCircle2,
//         color: "emerald",
//     },
// ];

// const recentScans = [
//     {
//         id: "SCN-1247",
//         name: "invoice_2026_q1.pdf",
//         type: "PDF",
//         size: "2.4 MB",
//         status: "completed",
//         date: "2 min ago",
//         pages: 12,
//     },
//     {
//         id: "SCN-1246",
//         name: "receipt_scan_042.jpg",
//         type: "Image",
//         size: "845 KB",
//         status: "completed",
//         date: "15 min ago",
//         pages: 1,
//     },
//     {
//         id: "SCN-1245",
//         name: "contract_draft_v3.pdf",
//         type: "PDF",
//         size: "5.1 MB",
//         status: "processing",
//         date: "32 min ago",
//         pages: 24,
//     },
//     {
//         id: "SCN-1244",
//         name: "passport_scan.png",
//         type: "Image",
//         size: "1.2 MB",
//         status: "completed",
//         date: "1 hr ago",
//         pages: 1,
//     },
//     {
//         id: "SCN-1243",
//         name: "bank_statement.pdf",
//         type: "PDF",
//         size: "3.8 MB",
//         status: "failed",
//         date: "2 hr ago",
//         pages: 8,
//     },
//     {
//         id: "SCN-1242",
//         name: "medical_report.pdf",
//         type: "PDF",
//         size: "4.2 MB",
//         status: "completed",
//         date: "3 hr ago",
//         pages: 15,
//     },
// ];

// const chartData = [
//     { day: "Mon", value: 45 },
//     { day: "Tue", value: 62 },
//     { day: "Wed", value: 38 },
//     { day: "Thu", value: 78 },
//     { day: "Fri", value: 92 },
//     { day: "Sat", value: 55 },
//     { day: "Sun", value: 68 },
// ];

// const activityFeed = [
//     {
//         user: "Sarah K.",
//         action: "uploaded",
//         target: "invoice_q1.pdf",
//         time: "2m",
//         initials: "SK",
//         color: "cyan",
//     },
//     {
//         user: "Marcus L.",
//         action: "exported",
//         target: "12 documents",
//         time: "18m",
//         initials: "ML",
//         color: "purple",
//     },
//     {
//         user: "Priya R.",
//         action: "completed scan of",
//         target: "passport.png",
//         time: "1h",
//         initials: "PR",
//         color: "emerald",
//     },
//     {
//         user: "James O.",
//         action: "invited",
//         target: "3 team members",
//         time: "3h",
//         initials: "JO",
//         color: "amber",
//     },
// ];

// /* ---------- Status Badge ---------- */
// const StatusBadge = ({ status }) => {
//     const config = {
//         completed: {
//             icon: CheckCircle2,
//             className:
//                 "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
//         },
//         processing: {
//             icon: Clock,
//             className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
//         },
//         failed: {
//             icon: XCircle,
//             className: "bg-red-500/10 text-red-400 border-red-500/20",
//         },
//     };
//     const { icon: Icon, className } = config[status] || config.completed;
//     return (
//         <span
//             className={clsx(
//                 "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
//                 className,
//             )}
//         >
//             <Icon className="h-3 w-3" />
//             {status}
//         </span>
//     );
// };

// /* ---------- Sidebar ---------- */
// const navItems = [
//     { icon: LayoutDashboard, label: "Dashboard", active: true },
//     { icon: FileText, label: "Documents", badge: "3.4k" },
//     { icon: ScanLine, label: "Scans" },
//     { icon: Users, label: "Team" },
//     { icon: CreditCard, label: "Billing" },
//     { icon: Settings, label: "Settings" },
// ];

// const Sidebar = ({ open, onClose }) => (
//     <>
//         {/* Mobile overlay */}
//         {open && (
//             <div
//                 className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
//                 onClick={onClose}
//             />
//         )}

//         <aside
//             className={clsx(
//                 "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 lg:translate-x-0",
//                 open ? "translate-x-0" : "-translate-x-full",
//             )}
//         >
//             {/* Logo */}
//             <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
//                 <div className="flex items-center gap-2.5">
//                     <div className="relative">
//                         <div className="absolute inset-0 rounded-lg bg-cyan-500/40 blur-md" />
//                         <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-slate-900">
//                             <ScanLine className="h-4 w-4 text-cyan-400" />
//                         </div>
//                     </div>
//                     <span className="text-lg font-bold text-white">
//                         OCR<span className="text-cyan-400">.</span>dev
//                     </span>
//                 </div>
//                 <button
//                     onClick={onClose}
//                     className="text-slate-500 hover:text-white lg:hidden"
//                 >
//                     <X className="h-5 w-5" />
//                 </button>
//             </div>

//             {/* Nav */}
//             <nav className="flex-1 space-y-1 overflow-y-auto p-4">
//                 {navItems.map(({ icon: Icon, label, active, badge }) => (
//                     <button
//                         key={label}
//                         className={clsx(
//                             "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
//                             active
//                                 ? "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20"
//                                 : "text-slate-400 hover:bg-slate-900 hover:text-white",
//                         )}
//                     >
//                         <Icon className="h-4 w-4" />
//                         <span>{label}</span>
//                         {badge && (
//                             <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
//                                 {badge}
//                             </span>
//                         )}
//                         {active && <ChevronRight className="ml-auto h-4 w-4" />}
//                     </button>
//                 ))}
//             </nav>

//             {/* Upgrade card */}
//             <div className="m-4 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4">
//                 <div className="flex items-center gap-2">
//                     <Zap className="h-4 w-4 text-cyan-400" />
//                     <p className="text-sm font-semibold text-white">Pro Plan</p>
//                 </div>
//                 <p className="mt-1 text-xs text-slate-400">
//                     8,153 / 10,000 scans used
//                 </p>
//                 <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
//                     <div className="h-full w-[81%] rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
//                 </div>
//                 <button className="mt-3 w-full rounded-lg bg-cyan-500 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400">
//                     Upgrade Plan
//                 </button>
//             </div>
//         </aside>
//     </>
// );

// /* ---------- Stat Card ---------- */
// const StatCard = ({ stat }) => {
//     const { label, value, change, trend, icon: Icon, color } = stat;
//     const colorMap = {
//         cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
//         purple: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
//         amber: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
//         emerald:
//             "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
//     };

//     return (
//         <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700">
//             <div
//                 className={clsx(
//                     "absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100",
//                     colorMap[color],
//                 )}
//             />
//             <div className="relative">
//                 <div className="flex items-start justify-between">
//                     <div
//                         className={clsx(
//                             "flex h-10 w-10 items-center justify-center rounded-xl border",
//                             colorMap[color],
//                         )}
//                     >
//                         <Icon className="h-5 w-5" />
//                     </div>
//                     <span
//                         className={clsx(
//                             "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
//                             trend === "up"
//                                 ? "bg-emerald-500/10 text-emerald-400"
//                                 : "bg-red-500/10 text-red-400",
//                         )}
//                     >
//                         {trend === "up" ? (
//                             <TrendingUp className="h-3 w-3" />
//                         ) : (
//                             <TrendingDown className="h-3 w-3" />
//                         )}
//                         {change}
//                     </span>
//                 </div>
//                 <p className="mt-4 text-2xl font-bold text-white">{value}</p>
//                 <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
//                     {label}
//                 </p>
//             </div>
//         </div>
//     );
// };

// /* ---------- Session helpers ---------- */
// const getUser = () => {
//     try {
//         return JSON.parse(localStorage.getItem("user"));
//     } catch {
//         return null;
//     }
// };
// const clearSession = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("user");
// };

// /* ---------- Main Dashboard ---------- */
// const Dashboard = () => {
//     const user = useMemo(() => getUser(), []);
//     const navigate = useNavigate();
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     const handleLogout = async () => {
//         try {
//             // TODO: call backend logout endpoint here (e.g. axios.post(`${BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true }))
//             clearSession();
//             toast.success("Logged out successfully");
//             navigate("/login", { replace: true });
//         } catch (err) {
//             toast.error("Failed to logout");
//         }
//     };

//     const handleAction = (action) => {
//         toast.success(`${action} — feature coming soon!`);
//     };

//     const maxChart = Math.max(...chartData.map((d) => d.value));

//     return (
//         <div className="min-h-screen bg-slate-950 text-white">
//             {/* Background grid + glow (matches login) */}
//             <div
//                 className="pointer-events-none fixed inset-0 opacity-[0.15]"
//                 style={{
//                     backgroundImage:
//                         "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
//                     backgroundSize: "48px 48px",
//                 }}
//             />
//             <div className="pointer-events-none fixed left-1/4 top-0 h-[400px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
//             <div className="pointer-events-none fixed bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />

//             <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//             {/* Main content */}
//             <div className="relative lg:pl-64">
//                 {/* Top bar */}
//                 <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
//                     <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
//                         <button
//                             onClick={() => setSidebarOpen(true)}
//                             className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
//                         >
//                             <Menu className="h-5 w-5" />
//                         </button>

//                         {/* Search */}
//                         <div className="relative hidden flex-1 max-w-md sm:block">
//                             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
//                             <input
//                                 type="text"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 placeholder="Search documents, scans..."
//                                 className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
//                             />
//                         </div>

//                         <div className="ml-auto flex items-center gap-2 sm:gap-3">
//                             <button
//                                 onClick={() => handleAction("New scan")}
//                                 className="hidden items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:flex"
//                             >
//                                 <Plus className="h-4 w-4" />
//                                 New Scan
//                             </button>

//                             <button
//                                 onClick={() => handleAction("Notifications")}
//                                 className="relative rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
//                             >
//                                 <Bell className="h-5 w-5" />
//                                 <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
//                             </button>

//                             {/* User avatar */}
//                             <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 py-1.5 pl-1.5 pr-3">
//                                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 text-xs font-bold text-white">
//                                     {user?.name?.[0]?.toUpperCase() || "U"}
//                                 </div>
//                                 <div className="hidden text-left sm:block">
//                                     <p className="text-xs font-semibold text-white">
//                                         {user?.name || "User"}
//                                     </p>
//                                     <p className="text-[10px] capitalize text-slate-500">
//                                         {user?.role?.replace("_", " ") ||
//                                             "Member"}
//                                     </p>
//                                 </div>
//                             </div>

//                             <button
//                                 onClick={handleLogout}
//                                 className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
//                             >
//                                 <LogOut className="h-4 w-4" />
//                                 <span className="hidden sm:inline">Logout</span>
//                             </button>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Main */}
//                 <main className="p-4 sm:p-6 lg:p-8">
//                     {/* Welcome header */}
//                     <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//                         <div>
//                             <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
//                                 Welcome back,{" "}
//                                 {user?.name?.split(" ")[0] || "User"} 👋
//                             </h1>
//                             <p className="mt-1 text-sm text-slate-400">
//                                 Here's what's happening with your scans today.
//                             </p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => handleAction("Export")}
//                                 className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
//                             >
//                                 <Download className="h-4 w-4" />
//                                 Export
//                             </button>
//                             <button
//                                 onClick={() => handleAction("Date filter")}
//                                 className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
//                             >
//                                 <Calendar className="h-4 w-4" />
//                                 Last 7 days
//                             </button>
//                         </div>
//                     </div>

//                     {/* Stats grid */}
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                         {stats.map((stat) => (
//                             <StatCard key={stat.label} stat={stat} />
//                         ))}
//                     </div>

//                     {/* Chart + Activity */}
//                     <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
//                         {/* Chart */}
//                         <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 lg:col-span-2">
//                             <div className="mb-6 flex items-center justify-between">
//                                 <div>
//                                     <h2 className="text-base font-semibold text-white">
//                                         Scan Activity
//                                     </h2>
//                                     <p className="text-xs text-slate-500">
//                                         Documents processed this week
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleAction("Filter chart")}
//                                     className="rounded-lg border border-slate-800 p-2 text-slate-400 transition hover:text-white"
//                                 >
//                                     <Filter className="h-4 w-4" />
//                                 </button>
//                             </div>

//                             {/* Bars */}
//                             <div className="flex h-48 items-end justify-between gap-2 sm:gap-4">
//                                 {chartData.map(({ day, value }) => (
//                                     <div
//                                         key={day}
//                                         className="group flex flex-1 flex-col items-center gap-2"
//                                     >
//                                         <div className="relative flex w-full flex-1 items-end">
//                                             <div
//                                                 className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500/40 to-cyan-500 transition-all duration-500 group-hover:from-cyan-400 group-hover:to-cyan-300"
//                                                 style={{
//                                                     height: `${(value / maxChart) * 100}%`,
//                                                 }}
//                                             >
//                                                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
//                                                     {value}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
//                                             {day}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Activity feed */}
//                         <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
//                             <div className="mb-5 flex items-center justify-between">
//                                 <h2 className="text-base font-semibold text-white">
//                                     Recent Activity
//                                 </h2>
//                                 <span className="relative flex h-2 w-2">
//                                     <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-cyan-400 opacity-75" />
//                                     <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
//                                 </span>
//                             </div>

//                             <ul className="space-y-4">
//                                 {activityFeed.map((item, i) => {
//                                     const colorMap = {
//                                         cyan: "from-cyan-500 to-cyan-600",
//                                         purple: "from-purple-500 to-purple-600",
//                                         emerald:
//                                             "from-emerald-500 to-emerald-600",
//                                         amber: "from-amber-500 to-amber-600",
//                                     };
//                                     return (
//                                         <li
//                                             key={i}
//                                             className="flex items-start gap-3"
//                                         >
//                                             <div
//                                                 className={clsx(
//                                                     "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white",
//                                                     colorMap[item.color],
//                                                 )}
//                                             >
//                                                 {item.initials}
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <p className="text-xs text-slate-300">
//                                                     <span className="font-semibold text-white">
//                                                         {item.user}
//                                                     </span>{" "}
//                                                     {item.action}{" "}
//                                                     <span className="font-medium text-cyan-400">
//                                                         {item.target}
//                                                     </span>
//                                                 </p>
//                                                 <p className="mt-0.5 text-[10px] text-slate-500">
//                                                     {item.time} ago
//                                                 </p>
//                                             </div>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>

//                             <button
//                                 onClick={() =>
//                                     handleAction("View all activity")
//                                 }
//                                 className="mt-5 w-full rounded-lg border border-slate-800 py-2 text-xs font-medium text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-400"
//                             >
//                                 View all activity
//                             </button>
//                         </div>
//                     </div>

//                     {/* Recent Scans Table */}
//                     <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50">
//                         <div className="flex items-center justify-between border-b border-slate-800 p-5">
//                             <div>
//                                 <h2 className="text-base font-semibold text-white">
//                                     Recent Scans
//                                 </h2>
//                                 <p className="text-xs text-slate-500">
//                                     Your latest document extractions
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={() => handleAction("View all scans")}
//                                 className="flex items-center gap-1 text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
//                             >
//                                 View all
//                                 <ChevronRight className="h-3.5 w-3.5" />
//                             </button>
//                         </div>

//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="border-b border-slate-800 text-left">
//                                         <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                                             Document
//                                         </th>
//                                         <th className="hidden px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
//                                             Type
//                                         </th>
//                                         <th className="hidden px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
//                                             Size
//                                         </th>
//                                         <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                                             Status
//                                         </th>
//                                         <th className="hidden px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
//                                             Date
//                                         </th>
//                                         <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
//                                             Actions
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {recentScans.map((scan) => (
//                                         <tr
//                                             key={scan.id}
//                                             className="group border-b border-slate-800/50 transition hover:bg-slate-800/30"
//                                         >
//                                             <td className="px-5 py-4">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
//                                                         <FileText className="h-4 w-4 text-slate-400" />
//                                                     </div>
//                                                     <div className="min-w-0">
//                                                         <p className="truncate text-sm font-medium text-white">
//                                                             {scan.name}
//                                                         </p>
//                                                         <p className="text-[10px] text-slate-500">
//                                                             {scan.id}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="hidden px-5 py-4 sm:table-cell">
//                                                 <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-400">
//                                                     {scan.type}
//                                                 </span>
//                                             </td>
//                                             <td className="hidden px-5 py-4 text-xs text-slate-400 md:table-cell">
//                                                 {scan.size}
//                                             </td>
//                                             <td className="px-5 py-4">
//                                                 <StatusBadge
//                                                     status={scan.status}
//                                                 />
//                                             </td>
//                                             <td className="hidden px-5 py-4 text-xs text-slate-400 lg:table-cell">
//                                                 {scan.date}
//                                             </td>
//                                             <td className="px-5 py-4">
//                                                 <div className="flex items-center justify-end gap-1">
//                                                     <button
//                                                         onClick={() =>
//                                                             handleAction(
//                                                                 `View ${scan.name}`,
//                                                             )
//                                                         }
//                                                         className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-400"
//                                                     >
//                                                         <Eye className="h-4 w-4" />
//                                                     </button>
//                                                     <button
//                                                         onClick={() =>
//                                                             handleAction(
//                                                                 `Download ${scan.name}`,
//                                                             )
//                                                         }
//                                                         className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-400"
//                                                     >
//                                                         <Download className="h-4 w-4" />
//                                                     </button>
//                                                     <button
//                                                         onClick={() =>
//                                                             handleAction(
//                                                                 `Delete ${scan.name}`,
//                                                             )
//                                                         }
//                                                         className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
//                                                     >
//                                                         <Trash2 className="h-4 w-4" />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-6 text-xs text-slate-600 sm:flex-row">
//                         <p>
//                             © {new Date().getFullYear()} OCR Scanner. All rights
//                             reserved.
//                         </p>
//                         <div className="flex items-center gap-4">
//                             <a href="#" className="hover:text-slate-400">
//                                 Privacy
//                             </a>
//                             <span>•</span>
//                             <a href="#" className="hover:text-slate-400">
//                                 Terms
//                             </a>
//                             <span>•</span>
//                             <a href="#" className="hover:text-slate-400">
//                                 Support
//                             </a>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    ScanLine,
    LayoutDashboard,
    FileText,
    Settings,
    Users,
    Bell,
    Search,
    Menu,
    X,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Eye,
    Trash2,
    Zap,
    CreditCard,
    ChevronRight,
    Calendar,
    Filter,
    Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

/* ---------- Dummy Data ---------- */
const stats = [
    {
        label: "Total Scans",
        value: "12,847",
        change: "+12.5%",
        trend: "up",
        icon: ScanLine,
        color: "red",
    },
    {
        label: "Documents",
        value: "3,429",
        change: "+8.2%",
        trend: "up",
        icon: FileText,
        color: "rose",
    },
    {
        label: "Processing",
        value: "24",
        change: "-3.1%",
        trend: "down",
        icon: Clock,
        color: "amber",
    },
    {
        label: "Accuracy",
        value: "99.2%",
        change: "+0.4%",
        trend: "up",
        icon: CheckCircle2,
        color: "emerald",
    },
];

const recentScans = [
    {
        id: "SCN-1247",
        name: "invoice_2026_q1.pdf",
        type: "PDF",
        size: "2.4 MB",
        status: "completed",
        date: "2 min ago",
        pages: 12,
    },
    {
        id: "SCN-1246",
        name: "receipt_scan_042.jpg",
        type: "Image",
        size: "845 KB",
        status: "completed",
        date: "15 min ago",
        pages: 1,
    },
    {
        id: "SCN-1245",
        name: "contract_draft_v3.pdf",
        type: "PDF",
        size: "5.1 MB",
        status: "processing",
        date: "32 min ago",
        pages: 24,
    },
    {
        id: "SCN-1244",
        name: "passport_scan.png",
        type: "Image",
        size: "1.2 MB",
        status: "completed",
        date: "1 hr ago",
        pages: 1,
    },
    {
        id: "SCN-1243",
        name: "bank_statement.pdf",
        type: "PDF",
        size: "3.8 MB",
        status: "failed",
        date: "2 hr ago",
        pages: 8,
    },
    {
        id: "SCN-1242",
        name: "medical_report.pdf",
        type: "PDF",
        size: "4.2 MB",
        status: "completed",
        date: "3 hr ago",
        pages: 15,
    },
];

const chartData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 62 },
    { day: "Wed", value: 38 },
    { day: "Thu", value: 78 },
    { day: "Fri", value: 92 },
    { day: "Sat", value: 55 },
    { day: "Sun", value: 68 },
];

const activityFeed = [
    {
        user: "Sarah K.",
        action: "uploaded",
        target: "invoice_q1.pdf",
        time: "2m",
        initials: "SK",
        color: "red",
    },
    {
        user: "Marcus L.",
        action: "exported",
        target: "12 documents",
        time: "18m",
        initials: "ML",
        color: "rose",
    },
    {
        user: "Priya R.",
        action: "completed scan of",
        target: "passport.png",
        time: "1h",
        initials: "PR",
        color: "emerald",
    },
    {
        user: "James O.",
        action: "invited",
        target: "3 team members",
        time: "3h",
        initials: "JO",
        color: "amber",
    },
];

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status }) => {
    const config = {
        completed: {
            icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-600 border-emerald-200",
        },
        processing: {
            icon: Clock,
            className: "bg-amber-50 text-amber-600 border-amber-200",
        },
        failed: {
            icon: XCircle,
            className: "bg-red-50 text-red-600 border-red-200",
        },
    };
    const { icon: Icon, className } = config[status] || config.completed;
    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                className,
            )}
        >
            <Icon className="h-3 w-3" />
            {status}
        </span>
    );
};

/* ---------- Sidebar ---------- */
const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FileText, label: "Documents", badge: "3.4k" },
    { icon: ScanLine, label: "Scans" },
    { icon: Users, label: "Team" },
    { icon: CreditCard, label: "Billing" },
    { icon: Settings, label: "Settings" },
];

const Sidebar = ({ open, onClose }) => (
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
                        OCR<span className="text-red-500">.</span>dev
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-900 lg:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navItems.map(({ icon: Icon, label, active, badge }) => (
                    <button
                        key={label}
                        className={clsx(
                            "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                            active
                                ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                        {badge && (
                            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                {badge}
                            </span>
                        )}
                        {active && <ChevronRight className="ml-auto h-4 w-4" />}
                    </button>
                ))}
            </nav>

            {/* Upgrade card */}
            <div className="m-4 rounded-xl bg-gradient-to-br from-red-600 to-red-500 p-4 shadow-lg shadow-red-600/20">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-white" />
                    <p className="text-sm font-semibold text-white">Pro Plan</p>
                </div>
                <p className="mt-1 text-xs text-red-100">
                    8,153 / 10,000 scans used
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-red-800/40">
                    <div className="h-full w-[81%] rounded-full bg-white" />
                </div>
                <button className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                    Upgrade Plan
                </button>
            </div>
        </aside>
    </>
);

/* ---------- Stat Card ---------- */
const iconColorMap = {
    red: "bg-red-50 text-red-600 border-red-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const glowColorMap = {
    red: "from-red-50 to-white",
    rose: "from-rose-50 to-white",
    amber: "from-amber-50 to-white",
    emerald: "from-emerald-50 to-white",
};

const StatCard = ({ stat }) => {
    const { label, value, change, trend, icon: Icon, color } = stat;

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md">
            <div
                className={clsx(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100",
                    glowColorMap[color],
                )}
            />
            <div className="relative">
                <div className="flex items-start justify-between">
                    <div
                        className={clsx(
                            "flex h-10 w-10 items-center justify-center rounded-xl border",
                            iconColorMap[color],
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                    <span
                        className={clsx(
                            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                            trend === "up"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-red-600",
                        )}
                    >
                        {trend === "up" ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {change}
                    </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-slate-900">
                    {value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {label}
                </p>
            </div>
        </div>
    );
};

/* ---------- Session helpers ---------- */
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

/* ---------- Main Dashboard ---------- */
const Dashboard = () => {
    const user = useMemo(() => getUser(), []);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = async () => {
        try {
            // TODO: call backend logout endpoint here (e.g. axios.post(`${BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true }))
            clearSession();
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch (err) {
            toast.error("Failed to logout");
        }
    };

    const handleAction = (action) => {
        toast.success(`${action} — feature coming soon!`);
    };

    const maxChart = Math.max(...chartData.map((d) => d.value));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Background grid + glow (matches login) */}
            <div
                className="pointer-events-none fixed inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="pointer-events-none fixed left-1/4 top-0 h-[400px] w-[600px] rounded-full bg-red-500/10 blur-[120px]" />
            <div className="pointer-events-none fixed bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-rose-500/10 blur-[100px]" />

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="relative lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                    <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Search */}
                        <div className="relative hidden flex-1 max-w-md sm:block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search documents, scans..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            />
                        </div>

                        <div className="ml-auto flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => handleAction("New scan")}
                                className="hidden items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 sm:flex"
                            >
                                <Plus className="h-4 w-4" />
                                New Scan
                            </button>

                            <button
                                onClick={() => handleAction("Notifications")}
                                className="relative rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            </button>

                            {/* User avatar */}
                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-400 text-xs font-bold text-white">
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="hidden text-left sm:block">
                                    <p className="text-xs font-semibold text-slate-900">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-[10px] capitalize text-slate-500">
                                        {user?.role?.replace("_", " ") ||
                                            "Member"}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Welcome header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Welcome back,{" "}
                                {user?.name?.split(" ")[0] || "User"} 👋
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Here's what's happening with your scans today.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleAction("Export")}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:text-red-600"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                            <button
                                onClick={() => handleAction("Date filter")}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:text-red-600"
                            >
                                <Calendar className="h-4 w-4" />
                                Last 7 days
                            </button>
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} stat={stat} />
                        ))}
                    </div>

                    {/* Chart + Activity */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Chart */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Scan Activity
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Documents processed this week
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAction("Filter chart")}
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:text-red-600"
                                >
                                    <Filter className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Bars */}
                            <div className="flex h-48 items-end justify-between gap-2 sm:gap-4">
                                {chartData.map(({ day, value }) => (
                                    <div
                                        key={day}
                                        className="group flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div className="relative flex w-full flex-1 items-end">
                                            <div
                                                className="w-full rounded-t-lg bg-gradient-to-t from-red-200 to-red-500 transition-all duration-500 group-hover:from-red-400 group-hover:to-red-600"
                                                style={{
                                                    height: `${(value / maxChart) * 100}%`,
                                                }}
                                            >
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                                                    {value}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                                            {day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity feed */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Recent Activity
                                </h2>
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                </span>
                            </div>

                            <ul className="space-y-4">
                                {activityFeed.map((item, i) => {
                                    const colorMap = {
                                        red: "from-red-500 to-red-600",
                                        rose: "from-rose-500 to-rose-600",
                                        emerald:
                                            "from-emerald-500 to-emerald-600",
                                        amber: "from-amber-500 to-amber-600",
                                    };
                                    return (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <div
                                                className={clsx(
                                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white",
                                                    colorMap[item.color],
                                                )}
                                            >
                                                {item.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-600">
                                                    <span className="font-semibold text-slate-900">
                                                        {item.user}
                                                    </span>{" "}
                                                    {item.action}{" "}
                                                    <span className="font-medium text-red-600">
                                                        {item.target}
                                                    </span>
                                                </p>
                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    {item.time} ago
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            <button
                                onClick={() =>
                                    handleAction("View all activity")
                                }
                                className="mt-5 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                View all activity
                            </button>
                        </div>
                    </div>

                    {/* Recent Scans Table */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Recent Scans
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Your latest document extractions
                                </p>
                            </div>
                            <button
                                onClick={() => handleAction("View all scans")}
                                className="flex items-center gap-1 text-xs font-medium text-red-600 transition hover:text-red-500"
                            >
                                View all
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/60 text-left">
                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Document
                                        </th>
                                        <th className="hidden px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                                            Type
                                        </th>
                                        <th className="hidden px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                                            Size
                                        </th>
                                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>
                                        <th className="hidden px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                                            Date
                                        </th>
                                        <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentScans.map((scan) => (
                                        <tr
                                            key={scan.id}
                                            className="group border-b border-slate-100 transition hover:bg-red-50/40"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50">
                                                        <FileText className="h-4 w-4 text-red-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-slate-900">
                                                            {scan.name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {scan.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden px-5 py-4 sm:table-cell">
                                                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                                    {scan.type}
                                                </span>
                                            </td>
                                            <td className="hidden px-5 py-4 text-xs text-slate-500 md:table-cell">
                                                {scan.size}
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={scan.status}
                                                />
                                            </td>
                                            <td className="hidden px-5 py-4 text-xs text-slate-500 lg:table-cell">
                                                {scan.date}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                `View ${scan.name}`,
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                `Download ${scan.name}`,
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                `Delete ${scan.name}`,
                                                            )
                                                        }
                                                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-100 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} OCR Scanner. All rights
                            reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-red-600">
                                Privacy
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-red-600">
                                Terms
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-red-600">
                                Support
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;