import { Menu, Search, Download } from "lucide-react";

const Header = ({
    onMenuClick,
    searchQuery,
    onSearchChange,
    onDownload,
    user,
}) => (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
            {/* Mobile menu toggle */}
            <button
                onClick={onMenuClick}
                aria-label="Open sidebar"
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
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search documents, scans..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
                {/* Download Excel */}
                <button
                    onClick={onDownload}
                    className="hidden items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98] sm:flex"
                >
                    <Download className="h-4 w-4" />
                    Download Excel
                </button>

                {/* User pill */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-xs font-bold text-white">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="hidden text-left sm:block">
                        <p className="text-xs font-semibold text-slate-900">
                            {user?.name || "User"}
                        </p>
                        <p className="text-[10px] capitalize text-slate-500">
                            {user?.role?.replace("_", " ") || "Member"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
