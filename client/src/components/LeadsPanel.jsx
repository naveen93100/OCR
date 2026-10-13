// import { useMemo, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import {
//     AllCommunityModule,
//     ModuleRegistry,
//     themeQuartz,
// } from "ag-grid-community";
// import {
//     ArrowLeft,
//     Download,
//     Phone,
//     Mail,
//     ChevronLeft,
//     ChevronRight,
// } from "lucide-react";

// ModuleRegistry.registerModules([AllCommunityModule]);

// const leadsTheme = themeQuartz.withParams({
//     accentColor: "#dc2626",
//     fontSize: 13,
//     foregroundColor: "#334155",
//     backgroundColor: "#ffffff",
//     headerBackgroundColor: "#f8fafc",
//     headerTextColor: "#64748b",
//     headerFontSize: 11,
//     headerFontWeight: 600,
//     borderColor: "#f1f5f9",
//     rowHoverColor: "#fef2f2",
//     columnBorder: false,
//     headerColumnBorder: false,
//     headerColumnResizeHandleDisplay: "none",
//     wrapperBorder: false,
//     wrapperBorderRadius: 0,
//     spacing: 8,
//     cellHorizontalPadding: 16,
// });

// const PAGE_SIZES = [10, 25, 50];

// const getInitials = (name = "") =>
//     name
//         .split(" ")
//         .filter(Boolean)
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase() || "?";

// /* ---------- Cell renderers ---------- */

// // customerName if present, otherwise companyName
// const CustomerCell = ({ data }) => {
//     const primary = data.customerName || data.companyName;
//     const secondary =
//         data.customerName && data.companyName ? data.companyName : null;

//     return (
//         <div className="flex h-full items-center gap-3">
//             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-[11px] font-bold text-white">
//                 {getInitials(primary)}
//             </div>
//             <div className="flex min-w-0 flex-col justify-center leading-tight">
//                 {primary ? (
//                     <span className="truncate font-medium text-slate-900">
//                         {primary}
//                     </span>
//                 ) : (
//                     <span className="truncate italic text-slate-400">
//                         Unnamed
//                     </span>
//                 )}
//                 {secondary && (
//                     <span className="truncate text-xs text-slate-500">
//                         {secondary}
//                     </span>
//                 )}
//             </div>
//         </div>
//     );
// };

// const ContactCell = ({ data }) => (
//     <div className="flex h-full flex-col justify-center gap-0.5 leading-tight">
//         {data.mobileNo && (
//             <a
//                 href={`tel:${data.mobileNo}`}
//                 className="flex items-center gap-1.5 text-slate-700 hover:text-red-600"
//             >
//                 <Phone className="h-3 w-3 shrink-0 text-slate-400" />
//                 {data.mobileNo}
//             </a>
//         )}
//         {data.email && (
//             <a
//                 href={`mailto:${data.email}`}
//                 className="flex items-center gap-1.5 truncate text-xs text-slate-500 hover:text-red-600"
//             >
//                 <Mail className="h-3 w-3 shrink-0 text-slate-400" />
//                 <span className="truncate">{data.email}</span>
//             </a>
//         )}
//         {!data.mobileNo && !data.email && (
//             <span className="text-slate-400">-</span>
//         )}
//     </div>
// );

// const RequirementCell = ({ value }) =>
//     value ? (
//         <div className="flex h-full items-center">
//             <span className="max-w-full truncate rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
//                 {value}
//             </span>
//         </div>
//     ) : (
//         <span className="text-slate-400">-</span>
//     );

// const CityCell = ({ value }) =>
//     value ? (
//         <div className="flex h-full items-center">
//             <span className="truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
//                 {value}
//             </span>
//         </div>
//     ) : (
//         <span className="text-slate-400">-</span>
//     );

// const DateCell = ({ value }) => {
//     if (!value) return <span className="text-slate-400">-</span>;
//     const d = new Date(value);
//     return (
//         <div className="flex h-full flex-col justify-center leading-tight">
//             <span className="text-slate-700">
//                 {d.toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                 })}
//             </span>
//             <span className="text-xs text-slate-400">
//                 {d.toLocaleTimeString("en-IN", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                 })}
//             </span>
//         </div>
//     );
// };

// /* ---------- Component ---------- */

// const LeadsPanel = ({
//     executive,
//     leads: pageLeads = [],
//     totalLead = 0,
//     hasNext = false,
//     loading = false,
//     page = 1,
//     limit = 10,
//     onPageChange,
//     onLimitChange,
//     searchQuery = "",
//     onBack,
// }) => {
//     const gridRef = useRef(null);
//     const q = searchQuery.trim().toLowerCase();

//     // NOTE: server paginates, so search only filters the rows of the current page.
//     // TODO: send `search` to the API for a full search across all pages.
//     const leads = useMemo(() => {
//         if (!q) return pageLeads;

//         const execMatch = [executive?.name, executive?.userId]
//             .join(" ")
//             .toLowerCase()
//             .includes(q);
//         if (execMatch) return pageLeads;

//         return pageLeads.filter((l) =>
//             [
//                 l.customerName,
//                 l.companyName,
//                 l.city,
//                 l.mobileNo,
//                 l.email,
//                 l.requirement,
//             ]
//                 .join(" ")
//                 .toLowerCase()
//                 .includes(q),
//         );
//     }, [pageLeads, executive, q]);

//     const columnDefs = useMemo(
//         () => [
//             {
//                 headerName: "#",
//                 // continues numbering across pages
//                 valueGetter: (p) => (page - 1) * limit + p.node.rowIndex + 1,
//                 width: 64,
//                 suppressMovable: true,
//             },
//             {
//                 headerName: "CUSTOMER",
//                 valueGetter: (p) =>
//                     [p.data.customerName, p.data.companyName]
//                         .filter(Boolean)
//                         .join(" - "),
//                 cellRenderer: CustomerCell,
//                 flex: 1.4,
//                 minWidth: 180,
//             },
//             {
//                 headerName: "CONTACT",
//                 valueGetter: (p) =>
//                     [p.data.mobileNo, p.data.email].filter(Boolean).join(" | "),
//                 cellRenderer: ContactCell,
//                 flex: 1.6,
//                 minWidth: 210,
//             },
//             {
//                 headerName: "REQUIREMENT",
//                 field: "requirement",
//                 cellRenderer: RequirementCell,
//                 flex: 1.2,
//                 minWidth: 140,
//             },
//             {
//                 headerName: "CITY",
//                 field: "city",
//                 cellRenderer: CityCell,
//                 flex: 0.9,
//                 minWidth: 110,
//             },
//             {
//                 headerName: "CREATED",
//                 field: "createdAt",
//                 cellRenderer: DateCell,
//                 flex: 1,
//                 minWidth: 120,
//             },
//         ],
//         [page, limit],
//     );

//     // sorting is off: the server decides the order (newest first)
//     const defaultColDef = useMemo(
//         () => ({
//             sortable: false,
//             resizable: false,
//             suppressHeaderFilterButton: true,
//             suppressHeaderMenuButton: true,
//         }),
//         [],
//     );

//     if (!executive) return null;

//     const totalPages = Math.max(1, Math.ceil(totalLead / limit));
//     const from = totalLead === 0 ? 0 : (page - 1) * limit + 1;
//     const to = totalLead === 0 ? 0 : (page - 1) * limit + pageLeads.length;

//     return (
//         <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//             {/* Header */}
//             <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-5">
//                 <button
//                     onClick={onBack}
//                     className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
//                 >
//                     <ArrowLeft className="h-4 w-4" />
//                     Back
//                 </button>
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-400 text-sm font-bold text-white">
//                     {getInitials(executive.name)}
//                 </div>
//                 <div className="min-w-0 flex-1">
//                     <h2 className="truncate text-base font-semibold capitalize text-slate-900">
//                         {executive.name}
//                     </h2>
//                     <p className="text-xs text-slate-500">
//                         {executive.userId} • {totalLead} lead
//                         {totalLead !== 1 ? "s" : ""}
//                     </p>
//                 </div>
//                 <button
//                     onClick={() =>
//                         gridRef.current?.api.exportDataAsCsv({
//                             fileName: `${executive.userId || "executive"}-leads-page-${page}.csv`,
//                         })
//                     }
//                     disabled={loading || leads.length === 0}
//                     title="Exports the rows of the current page"
//                     className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                     <Download className="h-4 w-4" />
//                     Export CSV
//                 </button>
//             </div>

//             {/* Grid (full-bleed, no inner padding) */}
//             <AgGridReact
//                 ref={gridRef}
//                 theme={leadsTheme}
//                 rowData={leads}
//                 loading={loading}
//                 columnDefs={columnDefs}
//                 defaultColDef={defaultColDef}
//                 getRowId={(p) => p.data._id}
//                 domLayout="autoHeight"
//                 rowHeight={60}
//                 headerHeight={40}
//                 suppressCellFocus
//                 overlayNoRowsTemplate="No leads found."
//             />

//             {/* Server-side pagination footer */}
//             <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-sm text-slate-600 sm:flex-row">
//                 <div className="flex items-center gap-2">
//                     <span className="text-xs text-slate-500">Rows per page</span>
//                     <select
//                         value={limit}
//                         onChange={(e) => onLimitChange?.(Number(e.target.value))}
//                         className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-red-300"
//                     >
//                         {PAGE_SIZES.map((s) => (
//                             <option key={s} value={s}>
//                                 {s}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <span className="text-xs text-slate-500">
//                     {from}-{to} of {totalLead}
//                 </span>

//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={() => onPageChange?.(page - 1)}
//                         disabled={page <= 1 || loading}
//                         className="flex items-center rounded-lg border border-slate-200 p-1.5 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
//                         aria-label="Previous page"
//                     >
//                         <ChevronLeft className="h-4 w-4" />
//                     </button>
//                     <span className="text-xs">
//                         Page {page} of {totalPages}
//                     </span>
//                     <button
//                         onClick={() => onPageChange?.(page + 1)}
//                         disabled={!hasNext || loading}
//                         className="flex items-center rounded-lg border border-slate-200 p-1.5 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
//                         aria-label="Next page"
//                     >
//                         <ChevronRight className="h-4 w-4" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LeadsPanel;



import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
} from "ag-grid-community";
import {
    ArrowLeft,
    Download,
    Loader2,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

const leadsTheme = themeQuartz.withParams({
    accentColor: "#dc2626",
    fontSize: 13,
    foregroundColor: "#334155",
    backgroundColor: "#ffffff",
    headerBackgroundColor: "#f8fafc",
    headerTextColor: "#64748b",
    headerFontSize: 11,
    headerFontWeight: 600,
    borderColor: "#f1f5f9",
    rowHoverColor: "#fef2f2",
    columnBorder: false,
    headerColumnBorder: false,
    headerColumnResizeHandleDisplay: "none",
    wrapperBorder: false,
    wrapperBorderRadius: 0,
    spacing: 8,
    cellHorizontalPadding: 16,
});

const PAGE_SIZES = [10, 25, 50];

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

/* ---------- Cell renderers ---------- */

// customerName if present, otherwise companyName
const CustomerCell = ({ data }) => {
    const primary = data.customerName || data.companyName;
    const secondary =
        data.customerName && data.companyName ? data.companyName : null;

    return (
        <div className="flex h-full items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-[11px] font-bold text-white">
                {getInitials(primary)}
            </div>
            <div className="flex min-w-0 flex-col justify-center leading-tight">
                {primary ? (
                    <span className="truncate font-medium text-slate-900">
                        {primary}
                    </span>
                ) : (
                    <span className="truncate italic text-slate-400">
                        Unnamed
                    </span>
                )}
                {secondary && (
                    <span className="truncate text-xs text-slate-500">
                        {secondary}
                    </span>
                )}
            </div>
        </div>
    );
};

const ContactCell = ({ data }) => (
    <div className="flex h-full flex-col justify-center gap-0.5 leading-tight">
        {data.mobileNo && (
            <a
                href={`tel:${data.mobileNo}`}
                className="flex items-center gap-1.5 text-slate-700 hover:text-red-600"
            >
                <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                {data.mobileNo}
            </a>
        )}
        {data.email && (
            <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-1.5 truncate text-xs text-slate-500 hover:text-red-600"
            >
                <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{data.email}</span>
            </a>
        )}
        {!data.mobileNo && !data.email && (
            <span className="text-slate-400">-</span>
        )}
    </div>
);

const RequirementCell = ({ value }) =>
    value ? (
        <div className="flex h-full items-center">
            <span className="max-w-full truncate rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                {value}
            </span>
        </div>
    ) : (
        <span className="text-slate-400">-</span>
    );

const CityCell = ({ value }) =>
    value ? (
        <div className="flex h-full items-center">
            <span className="truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {value}
            </span>
        </div>
    ) : (
        <span className="text-slate-400">-</span>
    );

const DateCell = ({ value }) => {
    if (!value) return <span className="text-slate-400">-</span>;
    const d = new Date(value);
    return (
        <div className="flex h-full flex-col justify-center leading-tight">
            <span className="text-slate-700">
                {d.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
            </span>
            <span className="text-xs text-slate-400">
                {d.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
        </div>
    );
};

/* ---------- Component ---------- */

const LeadsPanel = ({
    executive,
    leads: pageLeads = [],
    totalLead = 0,
    hasNext = false,
    loading = false,
    page = 1,
    limit = 10,
    onPageChange,
    onLimitChange,
    searchQuery = "",
    onBack,
    onDownload,
    downloading = false,
}) => {
    const q = searchQuery.trim().toLowerCase();

    // NOTE: server paginates, so search only filters the rows of the current page.
    // TODO: send `search` to the API for a full search across all pages.
    const leads = useMemo(() => {
        if (!q) return pageLeads;

        const execMatch = [executive?.name, executive?.userId]
            .join(" ")
            .toLowerCase()
            .includes(q);
        if (execMatch) return pageLeads;

        return pageLeads.filter((l) =>
            [
                l.customerName,
                l.companyName,
                l.city,
                l.mobileNo,
                l.email,
                l.requirement,
            ]
                .join(" ")
                .toLowerCase()
                .includes(q),
        );
    }, [pageLeads, executive, q]);

    const columnDefs = useMemo(
        () => [
            {
                headerName: "#",
                // continues numbering across pages
                valueGetter: (p) => (page - 1) * limit + p.node.rowIndex + 1,
                width: 64,
                suppressMovable: true,
            },
            {
                headerName: "CUSTOMER",
                valueGetter: (p) =>
                    [p.data.customerName, p.data.companyName]
                        .filter(Boolean)
                        .join(" - "),
                cellRenderer: CustomerCell,
                flex: 1.4,
                minWidth: 180,
            },
            {
                headerName: "CONTACT",
                valueGetter: (p) =>
                    [p.data.mobileNo, p.data.email].filter(Boolean).join(" | "),
                cellRenderer: ContactCell,
                flex: 1.6,
                minWidth: 210,
            },
            {
                headerName: "REQUIREMENT",
                field: "requirement",
                cellRenderer: RequirementCell,
                flex: 1.2,
                minWidth: 140,
            },
            {
                headerName: "CITY",
                field: "city",
                cellRenderer: CityCell,
                flex: 0.9,
                minWidth: 110,
            },
            {
                headerName: "CREATED",
                field: "createdAt",
                cellRenderer: DateCell,
                flex: 1,
                minWidth: 120,
            },
        ],
        [page, limit],
    );

    // sorting is off: the server decides the order (newest first)
    const defaultColDef = useMemo(
        () => ({
            sortable: false,
            resizable: false,
            suppressHeaderFilterButton: true,
            suppressHeaderMenuButton: true,
        }),
        [],
    );

    if (!executive) return null;

    const totalPages = Math.max(1, Math.ceil(totalLead / limit));
    const from = totalLead === 0 ? 0 : (page - 1) * limit + 1;
    const to = totalLead === 0 ? 0 : (page - 1) * limit + pageLeads.length;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-400 text-sm font-bold text-white">
                    {getInitials(executive.name)}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold capitalize text-slate-900">
                        {executive.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                        {executive.userId} • {totalLead} lead
                        {totalLead !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={onDownload}
                    disabled={downloading || loading || totalLead === 0}
                    title="Download all leads of this executive as Excel"
                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {downloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    Download Excel
                </button>
            </div>

            {/* Grid (full-bleed, no inner padding) */}
            <AgGridReact
                theme={leadsTheme}
                rowData={leads}
                loading={loading}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowId={(p) => p.data._id}
                domLayout="autoHeight"
                rowHeight={60}
                headerHeight={40}
                suppressCellFocus
                overlayNoRowsTemplate="No leads found."
            />

            {/* Server-side pagination footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-sm text-slate-600 sm:flex-row">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Rows per page</span>
                    <select
                        value={limit}
                        onChange={(e) => onLimitChange?.(Number(e.target.value))}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-red-300"
                    >
                        {PAGE_SIZES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <span className="text-xs text-slate-500">
                    {from}-{to} of {totalLead}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange?.(page - 1)}
                        disabled={page <= 1 || loading}
                        className="flex items-center rounded-lg border border-slate-200 p-1.5 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange?.(page + 1)}
                        disabled={!hasNext || loading}
                        className="flex items-center rounded-lg border border-slate-200 p-1.5 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadsPanel;