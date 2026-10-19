import { Menu, Download } from "lucide-react";

const Header = ({
    onMenuClick,
    onDownload,
    user,
}) => {

    return (
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

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    {/* Download Excel */}
                    {user?.role === 'super_adming' &&
                        <button
                            onClick={onDownload}
                            className=" items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 active:scale-[0.98] sm:flex"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:block">

                                Download Excel
                            </span>
                        </button>
                    }

                    {/* User pill */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-xs font-bold text-white">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className=" text-left sm:block">
                            <p className="text-xs capitalize font-semibold text-slate-900">
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
    )
}

export default Header;
