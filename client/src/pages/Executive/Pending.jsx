
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Clock3,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Building2,
    MapPin,
    Mail,
    Phone,
    Search,
} from "lucide-react";
import api from "../../api/axiosInstance";


const Pending = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);


    const fetchPendingCards = useCallback(async (showToast = false) => {
        setRefreshing(true);

        try {
            const response = await api.get(
                `/api/v1/executive/pending-cards`,
                {
                    withCredentials: true,
                }
            );

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message || "Failed to fetch pending cards"
                );
            }

            // Supports the existing API response: { success, formatLead: [] }
            const pendingCards = response.data.pendingCards || [];

            setCards(pendingCards);

            if (showToast) {
                toast.dismiss()
                toast.success("Pending cards refreshed");
            }
        } catch (error) {
            console.error("Error fetching pending cards:", error);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch pending cards"
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingCards();
    }, [fetchPendingCards]);


    const formatDate = (value) => {
        if (!value) return "—";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "—"
            : date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
    };

    return (
        <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <button
                        type="button"
                        onClick={() => fetchPendingCards(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""
                                }`}
                        />
                        Refresh
                    </button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                Pending Records
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {cards.length} pending{" "}
                                {cards.length === 1 ? "record" : "records"}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">Customer</th>
                                    <th className="px-5 py-4 font-semibold">Company</th>
                                    <th className="px-5 py-4 font-semibold">City</th>
                                    <th className="px-5 py-4 font-semibold">Contact</th>
                                    <th className="px-5 py-4 font-semibold">Requirement</th>
                                    <th className="px-5 py-4 font-semibold">Status</th>
                                    <th className="px-5 py-4 font-semibold">Uploaded</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center text-slate-500">
                                            Loading pending cards...
                                        </td>
                                    </tr>
                                ) : cards.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-16 text-center">
                                            <div className="mx-auto flex max-w-sm flex-col items-center">
                                                <div className="rounded-full bg-slate-100 p-4">
                                                    <Clock3 className="h-7 w-7 text-slate-400" />
                                                </div>
                                                <p className="mt-4 font-semibold text-slate-700">
                                                    No pending cards found
                                                </p>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    cards.map((card, index) => (
                                        <tr
                                            key={card._id || card.id || index}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-800">
                                                    {card.customerName || "—"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {card.email || "—"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                                                    {card.companyName || "—"}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 text-slate-600">
                                                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                                    {card.city || "—"}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="space-y-1.5">
                                                    <p className="flex items-center gap-1.5 text-slate-600">
                                                        <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        {card.mobileNo || card.mobileno || "—"}
                                                    </p>
                                                    <p className="flex items-center gap-1.5 text-slate-500">
                                                        <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                                        {card.email || "—"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="max-w-xs px-5 py-4 text-slate-600">
                                                <p className="line-clamp-2">
                                                    {card.requirement || "—"}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                    {card.status || "Pending"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                                {formatDate(card.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    
                     
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Pending;
