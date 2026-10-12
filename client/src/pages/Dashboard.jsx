import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    Download,
    Eye,
    Trash2,
    ChevronRight,
    UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import axios from "axios";
import { DUMMY_CARDS } from "./dummyCards";
import ExecutiveModal from "../components/ExecutiveModal";

const BASE_URL = import.meta.env.VITE_API_URL;

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
];

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

const Dashboard = () => {
    const { user, searchQuery } = useOutletContext();
    const [executiveModalOpen, setExecutiveModalOpen] = useState(false);

    const handleAction = (action) => {
        toast.success(`${action} — feature coming soon!`);
    };

    const filteredCard = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return DUMMY_CARDS;

        return DUMMY_CARDS.filter((card) =>
            [
                card.name,
                card.designation,
                card.company,
                card.phone,
                card.email,
                card.website,
                card.address,
            ]
                .join(" ")
                .toLowerCase()
                .includes(q),
        );
    }, [searchQuery]);

    // TODO: call this on mount once the backend endpoint is ready
    const getAllVisitingCardData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/`);
            console.log("Showing the visiting card", res.data);
        } catch (error) {
            console.log("Error", "Something is wrong", error);
            toast.error(
                error.response?.data?.message || "Fetch VisitingCard failed",
                { duration: 2000 },
            );
        }
    };

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            {/* Welcome header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Welcome back, {user?.name?.split(" ")[0] || "User"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Here's what's happening with your scans today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <button
                            onClick={() => setExecutiveModalOpen(true)}
                            className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add-Executive
                        </button>
                    </div>
                </div>
            </div>

            {/* Business Cards (TODO: replace DUMMY_CARDS with backend data) */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Business Cards
                        </h2>
                        <p className="text-xs text-slate-500">
                            {filteredCard.length} card
                            {filteredCard.length !== 1 ? "s" : ""} found
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </div>
                </div>

                {filteredCard.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        No cards match your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredCard.map((card) => (
                            <div
                                key={card._id}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-400 text-sm font-bold text-white">
                                        {(card.name || "")
                                            .split(" ")
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join("")}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {card.name}
                                        </p>
                                        <p className="truncate text-xs text-red-600">
                                            {card.designation}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {card.company}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                                    <p className="truncate">
                                        <span className="font-medium text-slate-400">
                                            📞{" "}
                                        </span>
                                        {card.phone}
                                    </p>
                                    <p className="truncate">
                                        <span className="font-medium text-slate-400">
                                            ✉️{" "}
                                        </span>
                                        {card.email}
                                    </p>
                                    <p className="truncate">
                                        <span className="font-medium text-slate-400">
                                            🌐{" "}
                                        </span>
                                        {card.website}
                                    </p>
                                    <p className="line-clamp-2">
                                        <span className="font-medium text-slate-400">
                                            📍{" "}
                                        </span>
                                        {card.address}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                                        <StatusBadge status={scan.status} />
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

            {/* Add Executive modal */}
            {executiveModalOpen && (
                <ExecutiveModal onClose={() => setExecutiveModalOpen(false)} />
            )}
        </main>
    );
};

export default Dashboard;
