
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Search,
    Eye,
    Loader2,
    Users,
    ChevronLeft,
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    X,
} from "lucide-react";
import api from '../../api/axiosInstance'

const BASE_URL = import.meta.env.VITE_API_URL;

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const AllLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalLeads, setTotalLeads] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchLeads = async () => {
            try {
                setLoading(true);

                const res = await api.get(
                    `${BASE_URL}/api/v1/admin/all-leads`,
                    {
                        params: {
                            pageNo: page,
                            limit,
                        },
                    }
                );

                if (cancelled) return;

                setLeads(res.data?.leads || []);
                setTotalLeads(res.data?.total || 0);
                setHasNext(
                    res.data.leads.length > 0 &&
                    page * limit < res.data.total
                );
            } catch (error) {
                console.log(error)
                if (!cancelled) {
                    toast.error(
                        error.response?.data?.message ||
                        "Failed to fetch leads"
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchLeads();

        return () => {
            cancelled = true;
        };
    }, [page, limit]);

    return (
        <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="mb-1 text-sm font-medium text-[#a20000]">
                        LEAD MANAGEMENT
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        All Leads
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        View and manage leads submitted by all executives.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="rounded-lg bg-red-50 p-2 text-[#a20000]">
                        <Users size={20} />
                    </div>

                    <div>
                        <p className="text-xs text-slate-500">
                            Total Leads
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                            {totalLeads.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table container */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Search and table information */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:p-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Lead Directory
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            All customer and executive records
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1150px] text-left">
                        <thead className="bg-slate-50">
                            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-5 py-4">Customer</th>
                                <th className="px-5 py-4">Company</th>
                                <th className="px-5 py-4">Contact</th>
                                <th className="px-5 py-4">City</th>
                                <th className="px-5 py-4">Requirement</th>
                                <th className="px-5 py-4">Executive</th>
                                <th className="px-5 py-4">Submitted On</th>
                                <th className="px-5 py-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-16 text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                                            <Loader2
                                                size={19}
                                                className="animate-spin text-[#a20000]"
                                            />
                                            Loading leads...
                                        </div>
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                                                <Users size={28} />
                                            </div>

                                            <p className="mt-4 text-sm font-semibold text-slate-800">
                                                No leads found
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {search
                                                    ? "Try a different search term."
                                                    : "Submitted leads will appear here."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr
                                        key={lead._id}
                                        className="transition hover:bg-slate-50/80"
                                    >
                                        {/* Customer */}
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-sm text-slate-900">
                                                {lead.customerName || "N/A"}
                                            </p>
                                        </td>

                                        {/* Company */}
                                        <td className="px-5 py-4">
                                            <p className="max-w-44 truncate text-sm text-slate-700">
                                                {lead.companyName || "N/A"}
                                            </p>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                {lead.mobileNo ? (
                                                    <a
                                                        href={`tel:${lead.mobileNo}`}
                                                        className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#a20000]"
                                                    >
                                                        <Phone
                                                            size={13}
                                                            className="shrink-0"
                                                        />
                                                        {lead.mobileNo}
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        No phone
                                                    </span>
                                                )}

                                                {lead.email ? (
                                                    <a
                                                        href={`mailto:${lead.email}`}
                                                        className="flex max-w-48 items-center gap-2 text-xs text-slate-600 hover:text-[#a20000]"
                                                    >
                                                        <Mail
                                                            size={13}
                                                            className="shrink-0"
                                                        />
                                                        <span className="truncate">
                                                            {lead.email}
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        No email
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* City */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <MapPin
                                                    size={14}
                                                    className="shrink-0 text-slate-400"
                                                />
                                                {lead.city || "N/A"}
                                            </div>
                                        </td>

                                        {/* Requirement */}
                                        <td className="px-5 py-4">
                                            <p
                                                title={lead.requirement || ""}
                                                className="max-w-44 truncate text-sm text-slate-600"
                                            >
                                                {lead.requirement || "N/A"}
                                            </p>
                                        </td>

                                        {/* Executive */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-slate-800">
                                                {lead.executiveName || "N/A"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {lead.executiveUserId || "N/A"}
                                            </p>
                                        </td>

                                        {/* Date */}
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="text-sm text-slate-700">
                                                {formatDate(lead.createdAt)}
                                            </p>
                                        </td>

                                        {/* Action */}
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    setSelectedLead(lead)
                                                }
                                                title="View lead details"
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#a20000]"
                                            >
                                                <Eye size={15} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col justify-between gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span>
                            {totalLeads === 0
                                ? "Showing 0 leads"
                                : `Showing ${(page - 1) * limit + 1}–${Math.min(
                                    page * limit,
                                    totalLeads
                                )} of ${totalLeads}`}
                        </span>

                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#a20000]"
                        >
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                            <option value={50}>50 / page</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((p) => p - 1)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <span className="px-2 text-sm font-medium text-slate-700">
                            {page}
                        </span>

                        <button
                            disabled={!hasNext || loading}
                            onClick={() => setPage((p) => p + 1)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Lead details modal */}
            {selectedLead && (
                <div
                    className="fixed  inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
                    onClick={() => setSelectedLead(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="lead-details-title"
                        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div>
                                <h2
                                    id="lead-details-title"
                                    className="text-lg font-bold text-slate-900"
                                >
                                    Lead Details
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Complete customer information
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedLead(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close lead details"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                            {[
                                ["Customer", selectedLead.customerName],
                                ["Company", selectedLead.companyName],
                                ["Mobile", selectedLead.mobileNo],
                                ["alternate.Mobile.No", selectedLead.alternateMobileNo],
                                ["customer.type", selectedLead.contactType],
                                ["Email", selectedLead.email],
                                ["City", selectedLead.city],
                                ["Requirement", selectedLead.requirement],
                                ["Executive", selectedLead.executiveName],
                                ["Executive ID", selectedLead.executiveUserId],
                                ["Submitted On", formatDate(selectedLead.createdAt)],
                            ].map(([label, value]) => (
                                <div key={label} className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        {label}
                                    </p>
                                    <p className="mt-1 capitalize break-words text-sm font-medium text-slate-800">
                                        {value || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end border-t border-slate-200 p-5">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="rounded-xl bg-[#a20000] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#850000]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AllLeads;
