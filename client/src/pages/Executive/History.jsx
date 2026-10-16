
import React, { useMemo, useState } from "react";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    History as HistoryIcon,
    Eye,
    RefreshCw,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

const History = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Replace this array with data fetched from your API.
    const [cards] = useState([]);

    const filteredCards = useMemo(() => {
        const query = search.trim().toLowerCase();

        return cards.filter((card) => {
            const matchesSearch = [
                card.customerName,
                card.companyName,
                card.city,
                card.mobileNo,
                card.email,
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

            const matchesStatus =
                statusFilter === "all" ||
                String(card.status || "").toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [cards, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCards.length / ITEMS_PER_PAGE)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedCards = filteredCards.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const statusStyles = {
        pending: "bg-amber-50 text-amber-700 ring-amber-200",
        "un-verified": "bg-blue-50 text-blue-700 ring-blue-200",
        verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        rejected: "bg-red-50 text-red-700 ring-red-200",
    };

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

    const changeSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const changeStatus = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Page heading */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-red-50 p-3">
                                <HistoryIcon className="h-6 w-6 text-[#a20000]" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Card History
                                </h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    View and manage your scanned visiting cards.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("all");
                            setCurrentPage(1);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-100"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Reset filters
                    </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Total records
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {cards.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Matching records
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {filteredCards.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Current page
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {filteredCards.length ? safePage : 0}
                            <span className="ml-1 text-base font-medium text-slate-400">
                                / {filteredCards.length ? totalPages : 0}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-bold">
                                All Cards
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Search records or filter by status.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        changeSearch(event.target.value)
                                    }
                                    placeholder="Search cards..."
                                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100 sm:w-64"
                                />
                            </div>

                            <div className="relative">
                                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        changeStatus(event.target.value)
                                    }
                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 sm:w-44"
                                >
                                    <option value="all">All statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="un-verified">Unverified</option>
                                    <option value="verified">Verified</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">
                                        Customer
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Company
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        City
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Mobile
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {paginatedCards.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <div className="mx-auto flex max-w-sm flex-col items-center">
                                                <div className="rounded-full bg-slate-100 p-4">
                                                    <HistoryIcon className="h-7 w-7 text-slate-400" />
                                                </div>
                                                <p className="mt-4 font-semibold text-slate-700">
                                                    No cards found
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Records will appear here when card data is loaded.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedCards.map((card, index) => {
                                        const status = String(
                                            card.status || "pending"
                                        ).toLowerCase();

                                        return (
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

                                                <td className="px-5 py-4 font-medium text-slate-700">
                                                    {card.companyName || "—"}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {card.city || "—"}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {card.mobileNo || "—"}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
                                                            statusStyles[status] ||
                                                            "bg-slate-100 text-slate-600 ring-slate-200"
                                                        }`}
                                                    >
                                                        {status.replace("-", " ")}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                                    {formatDate(card.createdAt)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            {filteredCards.length === 0
                                ? "No records to display"
                                : `Showing ${
                                      (safePage - 1) * ITEMS_PER_PAGE + 1
                                  }–${Math.min(
                                      safePage * ITEMS_PER_PAGE,
                                      filteredCards.length
                                  )} of ${filteredCards.length} records`}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={safePage <= 1 || !filteredCards.length}
                                onClick={() =>
                                    setCurrentPage((page) => page - 1)
                                }
                                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, index) => index + 1
                            )
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - safePage) <= 1
                                )
                                .map((page, index, pages) => (
                                    <React.Fragment key={page}>
                                        {index > 0 &&
                                            page - pages[index - 1] > 1 && (
                                                <span className="px-1 text-slate-400">
                                                    …
                                                </span>
                                            )}

                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${
                                                safePage === page
                                                    ? "bg-[#a20000] text-white"
                                                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))}

                            <button
                                type="button"
                                disabled={
                                    safePage >= totalPages ||
                                    !filteredCards.length
                                }
                                onClick={() =>
                                    setCurrentPage((page) => page + 1)
                                }
                                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default History;
