// import { useEffect, useMemo, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { UserPlus, Users, ChevronRight, Loader2, Pencil } from "lucide-react";
// import toast from "react-hot-toast";
// import clsx from "clsx";
// import axios from "axios";
// import ExecutiveModal from "../components/ExecutiveModal";
// import LeadsPanel from "../components/LeadsPanel";

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
//     // null = add mode, executive object = edit mode
//     const [editExecutive, setEditExecutive] = useState(null);

//     const [executives, setExecutives] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // leads view state
//     const [selectedId, setSelectedId] = useState(null);
//     const [leads, setLeads] = useState([]);
//     const [leadsMeta, setLeadsMeta] = useState({
//         totalLead: 0,
//         hasNext: false,
//     });
//     const [leadsLoading, setLeadsLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);

//     const downloadAllExecutiveLeads = async () => {
//         try {
//             const res = await axios.get(
//                 `${BASE_URL}/api/v1/admin/download-excel`,
//             );
//         } catch (error) {
//             console.log("error", error);
//             toast.error(error.response.data.message, {
//                 duration: 2000,
//             });
//         }
//     };

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

//     // GET /api/v1/admin/:executiveUserId?pageNo=&limit=
//     // response: { success, leads: [{ data: [...], hasNext, totalLead }] }
//     useEffect(() => {
//         if (!selectedUserId) return;

//         let cancelled = false; // ignore stale responses (fast clicks / Back)

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

//     const openAddModal = () => {
//         setEditExecutive(null);
//         setExecutiveModalOpen(true);
//     };

//     const openEditModal = (ex) => {
//         setEditExecutive(ex);
//         setExecutiveModalOpen(true);
//     };

//     const closeModal = () => {
//         setExecutiveModalOpen(false);
//         setEditExecutive(null);
//         getAllExecutives();
//     };

//     // TODO: replace with real API once backend is ready.
//     // `isActive` is not in the API response yet, so it defaults to true.
//     const handleToggleActive = async (ex) => {
//         const next = !(ex.isActive ?? true);

//         // optimistic update
//         setExecutives((prev) =>
//             prev.map((e) => (e._id === ex._id ? { ...e, isActive: next } : e)),
//         );

//         try {
//             // TODO: await axios.patch(`${BASE_URL}/api/v1/admin/executive/${ex._id}/status`, { isActive: next });
//             toast.success(`${ex.name} ${next ? "activated" : "deactivated"}`, {
//                 duration: 1500,
//             });
//         } catch (error) {
//             // rollback on failure
//             setExecutives((prev) =>
//                 prev.map((e) =>
//                     e._id === ex._id ? { ...e, isActive: !next } : e,
//                 ),
//             );
//             toast.error(
//                 error.response?.data?.message || "Status update failed",
//             );
//         }
//     };

//     const q = (searchQuery || "").trim().toLowerCase();

//     // executive list search: only name / userId / role (leads are not loaded here)
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
//                             onClick={openAddModal}
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
//                             {filteredExecutives.map((ex) => {
//                                 const isActive = ex.isActive ?? true;

//                                 return (
//                                     <div
//                                         key={ex._id}
//                                         role="button"
//                                         tabIndex={0}
//                                         onClick={() =>
//                                             handleSelectExecutive(ex)
//                                         }
//                                         onKeyDown={(e) => {
//                                             if (e.key === "Enter")
//                                                 handleSelectExecutive(ex);
//                                         }}
//                                         className={clsx(
//                                             "group flex cursor-pointer items-center gap-3 rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:border-red-200 hover:shadow-md",
//                                             isActive
//                                                 ? "border-slate-200"
//                                                 : "border-slate-200 bg-slate-50",
//                                         )}
//                                     >
//                                         <div
//                                             className={clsx(
//                                                 "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
//                                                 isActive
//                                                     ? "bg-linear-to-br from-red-600 to-red-400"
//                                                     : "bg-slate-300",
//                                             )}
//                                         >
//                                             {getInitials(ex.name)}
//                                         </div>

//                                         <div className="min-w-0 flex-1">
//                                             <p
//                                                 className={clsx(
//                                                     "truncate text-sm font-semibold capitalize",
//                                                     isActive
//                                                         ? "text-slate-900"
//                                                         : "text-slate-400",
//                                                 )}
//                                             >
//                                                 {ex.name}
//                                             </p>
//                                             <p className="truncate text-xs text-slate-500">
//                                                 {ex.userId}
//                                             </p>
//                                             <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
//                                                 {ex.leadCount || 0} lead
//                                                 {ex.leadCount !== 1 ? "s" : ""}
//                                             </span>
//                                         </div>

//                                         {/* Actions */}
//                                         <div className="flex shrink-0 items-center gap-2">
//                                             {/* Edit */}
//                                             <button
//                                                 type="button"
//                                                 title="Update executive"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     openEditModal(ex);
//                                                 }}
//                                                 className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
//                                             >
//                                                 <Pencil className="h-4 w-4" />
//                                             </button>

//                                             {/* Toggle */}
//                                             <button
//                                                 type="button"
//                                                 role="switch"
//                                                 aria-checked={isActive}
//                                                 title={
//                                                     isActive
//                                                         ? "Active — click to deactivate"
//                                                         : "Inactive — click to activate"
//                                                 }
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handleToggleActive(ex);
//                                                 }}
//                                                 className={clsx(
//                                                     "relative h-6 w-11 shrink-0 rounded-full transition-colors",
//                                                     isActive
//                                                         ? "bg-red-600"
//                                                         : "bg-slate-300",
//                                                 )}
//                                             >
//                                                 <span
//                                                     className={clsx(
//                                                         "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
//                                                         isActive
//                                                             ? "translate-x-5"
//                                                             : "translate-x-0",
//                                                     )}
//                                                 />
//                                             </button>

//                                             <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:text-red-600" />
//                                         </div>
//                                     </div>
//                                 );
//                             })}
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

//             {/* Add / Update Executive modal */}
//             {executiveModalOpen && (
//                 <ExecutiveModal
//                     // TODO: handle `executive` prop inside ExecutiveModal — prefill the form and call the update API when it is set
//                     executive={editExecutive}
//                     onClose={closeModal}
//                 />
//             )}
//         </main>
//     );
// };

// export default Dashboard;
import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { UserPlus, Users, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import ExecutiveModal from "../components/ExecutiveModal";
import LeadsPanel from "../components/LeadsPanel";
import { downloadExcel } from "../utils/downloadExcel";

const BASE_URL = import.meta.env.VITE_API_URL;

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

const Dashboard = () => {
    const { user, searchQuery } = useOutletContext();

    const [executiveModalOpen, setExecutiveModalOpen] = useState(false);

    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(null);
    const [leads, setLeads] = useState([]);
    const [leadsMeta, setLeadsMeta] = useState({
        totalLead: 0,
        hasNext: false,
    });
    const [leadsLoading, setLeadsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [downloading, setDownloading] = useState(false);

    const getAllExecutives = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/v1/admin`);
            setExecutives(res.data?.executives || []);
        } catch (error) {
            console.log("Error", "Something is wrong", error);
            toast.error(
                error.response?.data?.message || "Fetch executives failed",
                { duration: 2000 },
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllExecutives();
    }, []);

    const selectedExecutive = useMemo(
        () => executives.find((ex) => ex._id === selectedId) || null,
        [executives, selectedId],
    );
    const selectedUserId = selectedExecutive?.userId;

    useEffect(() => {
        if (!selectedUserId) return;

        let cancelled = false;

        const fetchLeads = async () => {
            try {
                setLeadsLoading(true);
                const res = await axios.get(
                    `${BASE_URL}/api/v1/admin/${selectedUserId}`,
                    { params: { pageNo: page, limit } },
                );
                if (cancelled) return;

                const block = res.data?.leads?.[0];
                setLeads(block?.data || []);
                setLeadsMeta({
                    totalLead: block?.totalLead || 0,
                    hasNext: !!block?.hasNext,
                });
            } catch (error) {
                if (cancelled) return;
                console.log("Error", "Something is wrong", error);
                toast.error(
                    error.response?.data?.message || "Fetch leads failed",
                    { duration: 2000 },
                );
            } finally {
                if (!cancelled) setLeadsLoading(false);
            }
        };

        fetchLeads();
        return () => {
            cancelled = true;
        };
    }, [selectedUserId, page, limit]);

    const handleDownloadExecutiveLeads = async () => {
        if (!selectedUserId || downloading) return;
        setDownloading(true);
        await downloadExcel(
            `${BASE_URL}/api/v1/admin/${selectedUserId}/export`,
            `${selectedUserId}-leads.xlsx`,
        );
        setDownloading(false);
    };

    const handleSelectExecutive = (ex) => {
        setLeads([]);
        setLeadsMeta({ totalLead: 0, hasNext: false });
        setPage(1);
        setSelectedId(ex._id);
    };

    const handleBack = () => {
        setSelectedId(null);
        setLeads([]);
        setLeadsMeta({ totalLead: 0, hasNext: false });
        setPage(1);
        setLeadsLoading(false);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const closeModal = () => {
        setExecutiveModalOpen(false);
        getAllExecutives();
    };

    const q = (searchQuery || "").trim().toLowerCase();

    const filteredExecutives = useMemo(() => {
        if (!q) return executives;
        return executives.filter((ex) =>
            [ex.name, ex.userId, ex.role].join(" ").toLowerCase().includes(q),
        );
    }, [executives, q]);

    const totalLeads = useMemo(
        () => executives.reduce((sum, ex) => sum + (ex.leadCount || 0), 0),
        [executives],
    );

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            {/* Welcome header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Welcome back, {user?.name?.split(" ")[0] || "User"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {executives.length} executive
                        {executives.length !== 1 ? "s" : ""} • {totalLeads}{" "}
                        total lead{totalLeads !== 1 ? "s" : ""}
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

            {selectedExecutive ? (
                /* Leads view */
                <LeadsPanel
                    executive={selectedExecutive}
                    leads={leads}
                    totalLead={leadsMeta.totalLead}
                    hasNext={leadsMeta.hasNext}
                    loading={leadsLoading}
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={handleLimitChange}
                    searchQuery={searchQuery}
                    onBack={handleBack}
                    onDownload={handleDownloadExecutiveLeads}
                    downloading={downloading}
                />
            ) : (
                /* Executives view */
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-200 p-5">
                        <Users className="h-4 w-4 text-red-600" />
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Executives
                            </h2>
                            <p className="text-xs text-slate-500">
                                {filteredExecutives.length} found
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                        </div>
                    ) : filteredExecutives.length === 0 ? (
                        <div className="p-10 text-center text-sm text-slate-500">
                            No executives found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredExecutives.map((ex) => (
                                <button
                                    key={ex._id}
                                    onClick={() => handleSelectExecutive(ex)}
                                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-red-200 hover:shadow-md"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-400 text-sm font-bold text-white">
                                        {getInitials(ex.name)}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold capitalize text-slate-900">
                                            {ex.name}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {ex.userId}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                                        {ex.leadCount || 0} lead
                                        {ex.leadCount !== 1 ? "s" : ""}
                                    </span>

                                    <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:text-red-600" />
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            )}

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
            {executiveModalOpen && <ExecutiveModal onClose={closeModal} />}
        </main>
    );
};

export default Dashboard;
