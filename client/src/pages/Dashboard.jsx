import { useEffect, useState } from "react";
import {
    UserPlus,
    Users,
    ContactRound,
    Search,
    ChevronRight,
    Loader2,
    Building2,
    MapPin,
    CalendarDays,
    ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";


const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const Dashboard = () => {

    const [totalExecutive, setTotalExecutive] = useState(0);
    const [recentLeads, setRecentLeads] = useState([]);
    const [totalLeads, setTotalLeads] = useState(0)

    useEffect(() => {

        const fetchDashboardData = async () => {
            try {
                const res = await api.get(
                    `/api/v1/admin`,
                );
                setRecentLeads(res.data?.recentLeads || []);
                setTotalLeads(res?.data?.totalLeads || 0);
                setTotalExecutive(res.data?.totalExecutive || []);

            } catch (er) {

                console.log(er)

            }
        }
        fetchDashboardData();
    }, []);

    const handleSelectExecutive = (executive) => {
        setLeads([]);
        setLeadsMeta({ totalLead: 0, hasNext: false });
        setPage(1);
        setSelectedId(executive._id);
    };


    return (
        <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            <>
                {/* Page header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-1 text-sm font-medium text-[#a20000]">
                            OVERVIEW
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Welcome back,{" "}
                            {"Admin"}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Monitor your executives and recently captured
                            leads.
                        </p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Executives
                                </p>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">

                                    {totalExecutive}

                                </h2>

                                <p className="mt-2 text-xs text-slate-500">
                                    Registered executives
                                </p>
                            </div>

                            <div className="rounded-xl bg-red-50 p-3 text-[#a20000]">
                                <Users size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Leads
                                </p>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                    {totalLeads}
                                </h2>

                                <p className="mt-2 text-xs text-slate-500">
                                    Leads captured by your team
                                </p>
                            </div>

                            <div className="rounded-xl bg-red-50 p-3 text-[#a20000]">
                                <ContactRound size={23} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent leads table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-2 border-b border-slate-200 p-2 sm:flex-row sm:items-center sm:p-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Recent Leads
                            </h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">City</th>
                                    <th className="px-6 py-4">Requirement</th>
                                    <th className="px-6 py-4">Added By</th>
                                    <th className="px-6 py-4">Created At</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {
                                    recentLeads.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-6 py-16 text-center"
                                            >
                                                <div className="mx-auto flex max-w-sm flex-col items-center">
                                                    <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                                                        <Building2 size={28} />
                                                    </div>

                                                    <p className="mt-4 text-sm font-semibold text-slate-800">
                                                        No recent leads found
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Newly submitted business
                                                        card details will appear
                                                        here.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        recentLeads.map((lead) => (
                                            <tr
                                                key={lead._id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {lead.customerName || "N/A"}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Building2
                                                            size={15}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                        <span className="max-w-48 truncate text-sm text-slate-700">
                                                            {lead.companyName || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                        <MapPin
                                                            size={14}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                        {lead.city || "N/A"}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className="block max-w-44 truncate text-sm text-slate-600"
                                                    >
                                                        {lead.requirement || "N/A"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 ">
                                                    <button
                                                        onClick={() => {
                                                            const executive =
                                                                executives.find(
                                                                    (ex) =>
                                                                        ex.userId ===
                                                                        lead.executiveUserId
                                                                );

                                                            if (executive) {
                                                                handleSelectExecutive(
                                                                    executive
                                                                );
                                                            } else {
                                                                toast.error(
                                                                    "Executive details not found"
                                                                );
                                                            }
                                                        }}
                                                        className="text-sm font-medium text-slate-700 transition hover:text-[#a20000]"
                                                    >
                                                        {lead.executiveName ||
                                                            lead.executiveUserId ||
                                                            "N/A"}
                                                    </button>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <CalendarDays
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {formatDate(
                                                            lead.createdAt
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col justify-between gap-2 border-t border-slate-200 bg-slate-50/50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
                        <span>
                            Showing recent lead
                        </span>

                        <span>
                            Latest submissions from all executives
                        </span>
                    </div>
                </section>
            </>
        </main>
    );
};

export default Dashboard;
