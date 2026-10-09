import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layers, LogOut, ScanLine } from "lucide-react";
import toast from "react-hot-toast";
import ScanPanel from "../components/executive/ScanPanel";
import CardForm from "../components/executive/CardForm";
import RecentCards from "../components/executive/RecentCards";

const BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- simple storage helpers (same keys as Login.jsx) ---------- */
const getToken = () => localStorage.getItem("access_token");

const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

const clearSession = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
};

/* keep digits only, strip +91 / leading 0 */
const cleanMobile = (v = "") => {
    let digits = String(v).replace(/\D/g, "");
    if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
    if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
    return digits;
};

/* ---------- single total stat ---------- */
const TotalStat = ({ value, loading }) => (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Contacts
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {loading ? "…" : value}
                </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Layers className="h-5 w-5" />
            </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-60" />
    </div>
);

const ExecutiveDashboard = () => {
    const navigate = useNavigate();
    const user = useMemo(() => getUser(), []); // read once -> stable reference

    const [cards, setCards] = useState([]);
    const [draft, setDraft] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [scannerKey, setScannerKey] = useState(0); // bump to reset ScanPanel
    const formRef = useRef(null);

    /* ---------- HISTORY ---------- */
    const getHistory = useCallback(async () => {
        try {
            setLoadingHistory(true);
            const { data } = await axios.get(
                `${BASE_URL}/api/v1/executive/history`,
                { withCredentials: true },
            );

            if (data?.success) {
                const sorted = [...(data.history || [])].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );
                setCards(sorted);
            }
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Could not load history",
            );
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    // no token -> back to login, otherwise load history once
    useEffect(() => {
        if (!user || !getToken()) {
            navigate("/login", { replace: true });
            return;
        }
        getHistory();
    }, [user, navigate, getHistory]);

    // scroll to form after a scan on mobile
    useEffect(() => {
        if (draft && window.innerWidth < 1024) {
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [draft]);

    const handleLogout = () => {
        clearSession();
        navigate("/login", { replace: true });
    };

    /* ---------- SCAN ---------- */
    const handleScan = async (file) => {
        try {
            setDraft(null);
            setScanning(true);

            const fd = new FormData();
            fd.append("cardImg", file);

            const { data } = await axios.post(
                `${BASE_URL}/api/v1/executive/scan-card`,
                fd,
                { withCredentials: true },
            );

            if (!data?.success) throw new Error(data?.message || "Scan failed");

            const d = data.data || {};

            setDraft({
                scanId: Date.now(),
                customerName: d.customerName || "",
                companyName: d.companyName || "",
                city: d.city || "",
                requirement: d.requirement || "",
                email: d.email || "",
                mobileNo: cleanMobile(d.mobileNo || d.mobileno),
            });

            toast.success("Card scanned. Please review the details.");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err.message || "Scan failed",
                {
                    duration: 2000,
                },
            );
        } finally {
            setScanning(false);
        }
    };

    /* ---------- SAVE ---------- */
    const handleSave = async (values) => {
        try {
            setSaving(true);

            const { data } = await axios.post(
                `${BASE_URL}/api/v1/executive/create-lead`,
                values,
                { withCredentials: true },
            );

            if (!data?.success) throw new Error(data?.message || "Save failed");

            setCards((prev) => [data.savedLead, ...prev]);
            setDraft(null);
            setScannerKey((k) => k + 1); // remount ScanPanel -> clears image/file
            toast.success("Contact saved");
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err.message || "Save failed",
                { duration: 2000 },
            );
        } finally {
            setSaving(false);
        }
    };

    const displayName = user?.name || user?.userId;

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
            {/* grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(226,232,240,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.7) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[80vw] max-w-160 -translate-x-1/2 rounded-full bg-red-500/10 blur-[110px] sm:h-96" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-[70vw] max-w-105 rounded-full bg-red-600/10 blur-[100px]" />

            {/* header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-xl bg-red-500/30 blur-md" />
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white shadow-sm sm:h-11 sm:w-11">
                                <ScanLine className="h-5 w-5 text-red-600" />
                            </div>
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base font-bold leading-tight tracking-tight sm:text-lg">
                                OCR<span className="text-red-600">.</span>dev
                            </h1>
                            <p className="truncate text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                                Executive Console
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        {displayName && (
                            <div className="hidden items-center gap-2 md:flex">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                                    {String(displayName)[0]?.toUpperCase()}
                                </span>
                                <p className="max-w-40 truncate capitalize text-sm font-medium text-slate-600">
                                    {displayName}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            aria-label="Logout"
                            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 sm:px-4"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-8 lg:px-6">
                <div className="mb-5 sm:mb-6">
                    <h2 className="text-xl font-bold capitalize tracking-tight sm:text-2xl">
                        {displayName ? `Hello, ${displayName}` : "Dashboard"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Scan a visiting card, review the details and save the
                        contact.
                    </p>
                </div>

                {/* single total count */}
                <section>
                    <TotalStat value={cards.length} loading={loadingHistory} />
                </section>

                <section className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <ScanPanel
                            key={scannerKey}
                            onScan={handleScan}
                            scanning={scanning}
                        />
                    </div>
                    <div ref={formRef} className="scroll-mt-20 lg:col-span-3">
                        {draft ? (
                            <CardForm
                                key={draft.scanId}
                                initial={draft}
                                saving={saving}
                                onSave={handleSave}
                                onDiscard={() => {
                                    setDraft(null);
                                    setScannerKey((k) => k + 1); // also clear scanner
                                }}
                            />
                        ) : (
                            <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center lg:min-h-64">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <ScanLine className="h-6 w-6" />
                                </span>
                                <p className="max-w-xs text-sm text-slate-500">
                                    Scan or upload a visiting card and the
                                    extracted details will appear here for
                                    review.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-5 sm:mt-6">
                    <RecentCards cards={cards} />
                </section>
            </main>
        </div>
    );
};

export default ExecutiveDashboard;
