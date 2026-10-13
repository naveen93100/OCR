
// import { useEffect, useMemo, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { UserPlus, Users, ChevronRight, Loader2 } from "lucide-react";
// import toast from "react-hot-toast";
// import axios from "axios";
// import ExecutiveModal from "../components/ExecutiveModal";
// import LeadsPanel from "../components/LeadsPanel";
// import { downloadExcel } from "../utils/downloadExcel";

// const BASE_URL = import.meta.env.VITE_API_URL;

// const getInitials = (name = "") =>
//     name
//         .split(" ")
//         .filter(Boolean)
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase() || "?";

// const Dashboard = () => {
//     const { user, searchQuery } = useOutletContext();

//     const [executiveModalOpen, setExecutiveModalOpen] = useState(false);

//     const [executives, setExecutives] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [selectedId, setSelectedId] = useState(null);
//     const [leads, setLeads] = useState([]);
//     const [leadsMeta, setLeadsMeta] = useState({
//         totalLead: 0,
//         hasNext: false,
//     });
//     const [leadsLoading, setLeadsLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [downloading, setDownloading] = useState(false);

//     const getAllExecutives = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`${BASE_URL}/api/v1/admin`);
//             setExecutives(res.data?.executives || []);
//         } catch (error) {
//             console.log("Error", "Something is wrong", error);
//             toast.error(
//                 error.response?.data?.message || "Fetch executives failed",
//                 { duration: 2000 },
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getAllExecutives();
//     }, []);

//     const selectedExecutive = useMemo(
//         () => executives.find((ex) => ex._id === selectedId) || null,
//         [executives, selectedId],
//     );
//     const selectedUserId = selectedExecutive?.userId;

//     useEffect(() => {
//         if (!selectedUserId) return;

//         let cancelled = false;

//         const fetchLeads = async () => {
//             try {
//                 setLeadsLoading(true);
//                 const res = await axios.get(
//                     `${BASE_URL}/api/v1/admin/${selectedUserId}`,
//                     { params: { pageNo: page, limit } },
//                 );
//                 if (cancelled) return;

//                 const block = res.data?.leads?.[0];
//                 setLeads(block?.data || []);
//                 setLeadsMeta({
//                     totalLead: block?.totalLead || 0,
//                     hasNext: !!block?.hasNext,
//                 });
//             } catch (error) {
//                 if (cancelled) return;
//                 console.log("Error", "Something is wrong", error);
//                 toast.error(
//                     error.response?.data?.message || "Fetch leads failed",
//                     { duration: 2000 },
//                 );
//             } finally {
//                 if (!cancelled) setLeadsLoading(false);
//             }
//         };

//         fetchLeads();
//         return () => {
//             cancelled = true;
//         };
//     }, [selectedUserId, page, limit]);

//     const handleDownloadExecutiveLeads = async () => {
//         if (!selectedUserId || downloading) return;
//         setDownloading(true);
//         await downloadExcel(
//             `${BASE_URL}/api/v1/admin/${selectedUserId}/export`,
//             `${selectedUserId}-leads.xlsx`,
//         );
//         setDownloading(false);
//     };

//     const handleSelectExecutive = (ex) => {
//         setLeads([]);
//         setLeadsMeta({ totalLead: 0, hasNext: false });
//         setPage(1);
//         setSelectedId(ex._id);
//     };

//     const handleBack = () => {
//         setSelectedId(null);
//         setLeads([]);
//         setLeadsMeta({ totalLead: 0, hasNext: false });
//         setPage(1);
//         setLeadsLoading(false);
//     };

//     const handleLimitChange = (newLimit) => {
//         setLimit(newLimit);
//         setPage(1);
//     };

//     const closeModal = () => {
//         setExecutiveModalOpen(false);
//         getAllExecutives();
//     };

//     const q = (searchQuery || "").trim().toLowerCase();

//     const filteredExecutives = useMemo(() => {
//         if (!q) return executives;
//         return executives.filter((ex) =>
//             [ex.name, ex.userId, ex.role].join(" ").toLowerCase().includes(q),
//         );
//     }, [executives, q]);

//     const totalLeads = useMemo(
//         () => executives.reduce((sum, ex) => sum + (ex.leadCount || 0), 0),
//         [executives],
//     );

//     return (
//         <main className="p-4 sm:p-6 lg:p-8">
//             {/* Welcome header */}
//             <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                         Welcome back, {user?.name?.split(" ")[0] || "User"}
//                     </h1>
//                     <p className="mt-1 text-sm text-slate-500">
//                         {executives.length} executive
//                         {executives.length !== 1 ? "s" : ""} • {totalLeads}{" "}
//                         total lead{totalLeads !== 1 ? "s" : ""}
//                     </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//                         <button
//                             onClick={() => setExecutiveModalOpen(true)}
//                             className="group flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
//                         >
//                             <UserPlus className="h-4 w-4" />
//                             Add-Executive
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {selectedExecutive ? (
//                 /* Leads view */
//                 <LeadsPanel
//                     executive={selectedExecutive}
//                     leads={leads}
//                     totalLead={leadsMeta.totalLead}
//                     hasNext={leadsMeta.hasNext}
//                     loading={leadsLoading}
//                     page={page}
//                     limit={limit}
//                     onPageChange={setPage}
//                     onLimitChange={handleLimitChange}
//                     searchQuery={searchQuery}
//                     onBack={handleBack}
//                     onDownload={handleDownloadExecutiveLeads}
//                     downloading={downloading}
//                 />
//             ) : (
//                 /* Executives view */
//                 <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//                     <div className="flex items-center gap-2 border-b border-slate-200 p-5">
//                         <Users className="h-4 w-4 text-red-600" />
//                         <div>
//                             <h2 className="text-base font-semibold text-slate-900">
//                                 Executives
//                             </h2>
//                             <p className="text-xs text-slate-500">
//                                 {filteredExecutives.length} found
//                                 {searchQuery && ` for "${searchQuery}"`}
//                             </p>
//                         </div>
//                     </div>

//                     {loading ? (
//                         <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             Loading...
//                         </div>
//                     ) : filteredExecutives.length === 0 ? (
//                         <div className="p-10 text-center text-sm text-slate-500">
//                             No executives found.
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
//                             {filteredExecutives.map((ex) => (
//                                 <button
//                                     key={ex._id}
//                                     onClick={() => handleSelectExecutive(ex)}
//                                     className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-red-200 hover:shadow-md"
//                                 >
//                                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-400 text-sm font-bold text-white">
//                                         {getInitials(ex.name)}
//                                     </div>

//                                     <div className="min-w-0 flex-1">
//                                         <p className="truncate text-sm font-semibold capitalize text-slate-900">
//                                             {ex.name}
//                                         </p>
//                                         <p className="truncate text-xs text-slate-500">
//                                             {ex.userId}
//                                         </p>
//                                     </div>

//                                     <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
//                                         {ex.leadCount || 0} lead
//                                         {ex.leadCount !== 1 ? "s" : ""}
//                                     </span>

//                                     <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:text-red-600" />
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </section>
//             )}

//             {/* Footer */}
//             <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
//                 <p>
//                     © {new Date().getFullYear()} OCR Scanner. All rights
//                     reserved.
//                 </p>
//                 <div className="flex items-center gap-4">
//                     <a href="#" className="hover:text-red-600">
//                         Privacy
//                     </a>
//                     <span>•</span>
//                     <a href="#" className="hover:text-red-600">
//                         Terms
//                     </a>
//                     <span>•</span>
//                     <a href="#" className="hover:text-red-600">
//                         Support
//                     </a>
//                 </div>
//             </div>

//             {/* Add Executive modal */}
//             {executiveModalOpen && <ExecutiveModal onClose={closeModal} />}
//         </main>
//     );
// };

// export default Dashboard;


import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
import axios from "axios";
import ExecutiveModal from "../components/ExecutiveModal";
import LeadsPanel from "../components/LeadsPanel";

const BASE_URL = import.meta.env.VITE_API_URL;

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const Dashboard = () => {

    const [executiveModalOpen, setExecutiveModalOpen] = useState(false);
    const [totalExecutive, setTotalExecutive] = useState(0);
    const [recentLeads, setRecentLeads] = useState([]);
    const [totalLeads, setTotalLeads] = useState(0)
    const [loading, setLoading] = useState(true);
    const [leadsLoading, setLeadsLoading] = useState(true);

    useEffect(() => {

        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(
                    `${BASE_URL}/api/v1/admin`,
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

                    <button
                        onClick={() => setExecutiveModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a20000] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#850000] focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        <UserPlus size={17} />
                        Add Executive
                    </button>
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


            {executiveModalOpen && (
                <ExecutiveModal onClose={closeModal} />
            )}
        </main>
    );
};

export default Dashboard;
