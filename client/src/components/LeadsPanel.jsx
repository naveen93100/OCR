// import { useMemo, useRef } from "react";
// import { AgGridReact } from "ag-grid-react";
// import {
//     AllCommunityModule,
//     ModuleRegistry,
//     themeQuartz,
// } from "ag-grid-community";
// import { ArrowLeft, Download, Phone, Mail } from "lucide-react";

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

// const getInitials = (name = "") =>
//     name
//         .split(" ")
//         .filter(Boolean)
//         .map((n) => n[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase() || "?";

// /* ---------- Cell renderers ---------- */

// const CustomerCell = ({ data }) => (
//     <div className="flex h-full items-center gap-3">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-[11px] font-bold text-white">
//             {getInitials(data.customerName)}
//         </div>
//         {data.customerName ? (
//             <span className="truncate font-medium text-slate-900">
//                 {data.customerName}
//             </span>
//         ) : (
//             <span className="truncate italic text-slate-400">Unnamed</span>
//         )}
//     </div>
// );

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

// const LeadsPanel = ({ executive, searchQuery = "", onBack }) => {
//     const gridRef = useRef(null);
//     const q = searchQuery.trim().toLowerCase();

//     const leads = useMemo(() => {
//         const all = executive?.leads || [];
//         if (!q) return all;

//         const execMatch = [executive?.name, executive?.userId]
//             .join(" ")
//             .toLowerCase()
//             .includes(q);
//         if (execMatch) return all;

//         return all.filter((l) =>
//             [l.customerName, l.city, l.mobileNo, l.email, l.requirement]
//                 .join(" ")
//                 .toLowerCase()
//                 .includes(q),
//         );
//     }, [executive, q]);

//     const columnDefs = useMemo(
//         () => [
//             {
//                 headerName: "#",
//                 valueGetter: (p) => p.node.rowIndex + 1,
//                 width: 56,
//                 sortable: false,
//                 suppressMovable: true,
//             },
//             {
//                 headerName: "CUSTOMER",
//                 field: "customerName",
//                 cellRenderer: CustomerCell,
//                 flex: 1.3,
//                 minWidth: 170,
//             },
//             {
//                 headerName: "CONTACT",
//                 // plain text value so CSV export / sorting still work
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
//                 flex: 1.4,
//                 minWidth: 150,
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
//                 sort: "desc",
//             },
//         ],
//         [],
//     );

//     const defaultColDef = useMemo(
//         () => ({
//             sortable: true,
//             resizable: false,
//             suppressHeaderFilterButton: true,
//             suppressHeaderMenuButton: true,
//         }),
//         [],
//     );

//     if (!executive) return null;

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
//                         {executive.userId} • {leads.length} lead
//                         {leads.length !== 1 ? "s" : ""}
//                     </p>
//                 </div>
//                 <button
//                     onClick={() =>
//                         gridRef.current?.api.exportDataAsCsv({
//                             fileName: `${executive.userId || "executive"}-leads.csv`,
//                         })
//                     }
//                     className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
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
//                 columnDefs={columnDefs}
//                 defaultColDef={defaultColDef}
//                 getRowId={(p) => p.data._id}
//                 domLayout="autoHeight"
//                 rowHeight={60}
//                 headerHeight={40}
//                 suppressCellFocus
//                 pagination
//                 paginationPageSize={10}
//                 paginationPageSizeSelector={[10, 25, 50]}
//                 overlayNoRowsTemplate="No leads found."
//             />
//         </div>
//     );
// };

// export default LeadsPanel;



import { useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    AllCommunityModule,
    ModuleRegistry,
    themeQuartz,
} from "ag-grid-community";
import { ArrowLeft, Download, Phone, Mail } from "lucide-react";

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

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";

/* ---------- Cell renderers ---------- */

const CustomerCell = ({ data }) => (
    <div className="flex h-full items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-[11px] font-bold text-white">
            {getInitials(data.customerName)}
        </div>
        {data.customerName ? (
            <span className="truncate font-medium text-slate-900">
                {data.customerName}
            </span>
        ) : (
            <span className="truncate italic text-slate-400">Unnamed</span>
        )}
    </div>
);

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

/* Full text is shown by wrapping; tooltip as fallback for very long values */
const RequirementCell = ({ value }) => {
    if (!value) return <span className="text-slate-400">-</span>;
    return (
        <div className="flex h-full items-center py-1">
            <span
                title={value}
                className="max-w-full whitespace-normal wrap-break-word rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
            >
                {value}
            </span>
        </div>
    );
};

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

const LeadsPanel = ({ executive, searchQuery = "", onBack }) => {
    const gridRef = useRef(null);
    const q = searchQuery.trim().toLowerCase();

    const leads = useMemo(() => {
        const all = executive?.leads || [];
        if (!q) return all;

        const execMatch = [executive?.name, executive?.userId]
            .join(" ")
            .toLowerCase()
            .includes(q);
        if (execMatch) return all;

        return all.filter((l) =>
            [l.customerName, l.city, l.mobileNo, l.email, l.requirement]
                .join(" ")
                .toLowerCase()
                .includes(q),
        );
    }, [executive, q]);

    const columnDefs = useMemo(
        () => [
            {
                headerName: "#",
                valueGetter: (p) => p.node.rowIndex + 1,
                width: 56,
                sortable: false,
                suppressMovable: true,
            },
            {
                headerName: "CUSTOMER",
                field: "customerName",
                cellRenderer: CustomerCell,
                flex: 1.3,
                minWidth: 170,
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
                flex: 1.4,
                minWidth: 150,
                wrapText: true,
                autoHeight: true,
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
                sort: "desc",
            },
        ],
        [],
    );

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            resizable: false,
            suppressHeaderFilterButton: true,
            suppressHeaderMenuButton: true,
        }),
        [],
    );

    if (!executive) return null;

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
                        {executive.userId} • {leads.length} lead
                        {leads.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() =>
                        gridRef.current?.api.exportDataAsCsv({
                            fileName: `${executive.userId || "executive"}-leads.csv`,
                        })
                    }
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
            </div>

            {/* Grid */}
            <AgGridReact
                ref={gridRef}
                theme={leadsTheme}
                rowData={leads}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowId={(p) => p.data._id}
                domLayout="autoHeight"
                /* NOTE: rowHeight removed so autoHeight on REQUIREMENT column can grow rows */
                headerHeight={40}
                suppressCellFocus
                pagination
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 25, 50]}
                overlayNoRowsTemplate="No leads found."
            />
        </div>
    );
};

export default LeadsPanel;
