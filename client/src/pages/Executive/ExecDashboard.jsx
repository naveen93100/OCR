import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Layers,
    Clock3,
    XCircle,
    CheckCircle2,
    ShieldQuestion,
    ScanLine,
} from "lucide-react";
import toast from "react-hot-toast";

import ScanPanel from "../../components/executive/ScanPanel";
import api from "../../api/axiosInstance";

const REFRESH_MS = 10000;

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


function StatCard({ icon: Icon, label, value, loading, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${active
                ? "border-red-300 ring-2 ring-red-100"
                : "border-slate-200"
                }`}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-500">
                    {label}
                </span>
                <Icon className="h-5 w-5 shrink-0 text-[#a20000]" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
                {loading ? "…" : value}
            </p>
        </button>
    );
}

export default function ExecutiveDashboard() {
    const navigate = useNavigate();
    const user = useMemo(getUser, []);


    const [dashboardData, setDashboardData] = useState({
        total: 0,
        pending: 0,
        verified: 0,
        unverified: 0,
        rejected: 0,
    });

    const [loadingDashboard, setLoadingDashboard] = useState(true);

    const [pendingError, setPendingError] = useState("");

    const [activeFilter, setActiveFilter] = useState("all");

    const [scanning, setScanning] = useState(false);
    const [scannerKey, setScannerKey] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const dashboardController = useRef(null);
    const historyController = useRef(null);
    const pendingController = useRef(null);
    const scanController = useRef(null);

    const scanBusy = useRef(false);
    const mounted = useRef(false);
    const authExpired = useRef(false);

    const handleAuthError = useCallback(
        (err) => {
            if (err?.response?.status !== 401) return false;

            if (!authExpired.current) {
                authExpired.current = true;
                clearSession();
                toast.error("Session expired. Please login again.");
                navigate("/login", { replace: true });
            }

            return true;
        },
        [navigate]
    );

    // Fetch dashboard summary counts.
    const getDashboardData = useCallback(async () => {
        if (authExpired.current) return;

        dashboardController.current?.abort();

        const controller = new AbortController();
        dashboardController.current = controller;

        try {
            const { data } = await api.get(
                `/api/v1/executive/`,
                {
                    withCredentials: true,
                    signal: controller.signal,
                }
            );

            if (!data?.success) {
                throw new Error(
                    data?.message || "Failed to fetch dashboard data"
                );
            }

            if (!mounted.current || controller.signal.aborted) return;

            setDashboardData({
                total: data.total ?? 0,
                pending: data.pending ?? 0,
                verified: data.verified ?? 0,
                unverified: data.unverified ?? 0,
                rejected: data.rejected ?? 0,
            });
        } catch (err) {
            if (controller.signal.aborted || !mounted.current) return;
            if (handleAuthError(err)) return;

            toast.error(
                err?.response?.data?.message ||
                err.message ||
                "Could not load dashboard data"
            );
        } finally {
            if (
                mounted.current &&
                dashboardController.current === controller
            ) {
                setLoadingDashboard(false);
                dashboardController.current = null;
            }
        }
    }, [handleAuthError]);



    // Fetch pending cards.
    const getPendingCards = useCallback(
        async ({ silent = false } = {}) => {
            if (authExpired.current) return;

            pendingController.current?.abort();

            const controller = new AbortController();
            pendingController.current = controller;

            try {
                const { data } = await api.get(
                    `/api/v1/executive/get/pending`,
                    {
                        withCredentials: true,
                        signal: controller.signal,
                    }
                );

                const rows = data?.formatLead;

                if (data?.success === false || !Array.isArray(rows)) {
                    throw new Error(
                        data?.message || "Invalid pending-cards response"
                    );
                }

                if (!mounted.current || controller.signal.aborted) return;

                setPendingError("");
            } catch (err) {
                if (controller.signal.aborted || !mounted.current) return;
                if (handleAuthError(err)) return;

                setPendingError(
                    err?.response?.data?.message ||
                    err.message ||
                    "Could not load pending cards"
                );
            } finally {
                if (
                    mounted.current &&
                    pendingController.current === controller
                ) {
                    pendingController.current = null;
                }
            }
        },
        [handleAuthError]
    );

    // Initial loading and automatic refresh.
    useEffect(() => {
        mounted.current = true;

        if (!user || !localStorage.getItem("access_token")) {
            navigate("/login", { replace: true });

            return () => {
                mounted.current = false;
            };
        }

        void getDashboardData();
        void getPendingCards();

        const refresh = () => {
            if (document.visibilityState !== "visible") return;

            if (!dashboardController.current) {
                void getDashboardData();
            }

            if (!pendingController.current) {
                void getPendingCards({ silent: true });
            }
        };

        const interval = window.setInterval(refresh, REFRESH_MS);

        document.addEventListener("visibilitychange", refresh);

        return () => {
            mounted.current = false;

            window.clearInterval(interval);
            document.removeEventListener("visibilitychange", refresh);

            dashboardController.current?.abort();
            historyController.current?.abort();
            pendingController.current?.abort();
            scanController.current?.abort();
        };
    }, [
        user,
        navigate,
        getDashboardData,
        getPendingCards,
    ]);

    // Scan or upload a card without opening a draft form.
    const handleScan = async (file) => {
        if (scanBusy.current || authExpired.current) return;

        if (!(file instanceof Blob) || !file.size) {
            toast.error("Please select or capture a card image.");
            return;
        }

        scanBusy.current = true;
        setScanning(true);
        setSubmitted(false);

        const controller = new AbortController();
        scanController.current = controller;

        try {
            const formData = new FormData();
            formData.append("images", file);

            const { data } = await api.post(
                `/api/v1/executive/scan-single`,
                formData,
                {
                    withCredentials: true,
                    signal: controller.signal,
                }
            );

            if (!data?.success) {
                throw new Error(data?.message || "Card submission failed");
            }

            if (!mounted.current) return;

            setSubmitted(true);
            setScannerKey((key) => key + 1);

            toast.success(
                "Your card is processing. Please check Pending Cards.",
                { duration: 5000 }
            );

            void getDashboardData();
            void getPendingCards({ silent: true });
        } catch (err) {
            if (controller.signal.aborted || !mounted.current) return;
            if (handleAuthError(err)) return;

            toast.error(
                err?.response?.data?.message ||
                err.message ||
                "Could not submit card"
            );
        } finally {
            scanBusy.current = false;

            if (mounted.current) setScanning(false);

            if (scanController.current === controller) {
                scanController.current = null;
            }
        }
    };


    // Dashboard counts come from the dashboard API.
    const statItems = [
        {
            label: "Total Cards",
            value: dashboardData.total,
            filter: "all",
            icon: Layers,
        },
        {
            label: "Pending",
            value: dashboardData.pending,
            filter: "pending",
            icon: Clock3,
        },
        {
            label: "Rejected",
            value: dashboardData.rejected,
            filter: "rejected",
            icon: XCircle,
        },
        {
            label: "Verified",
            value: dashboardData.verified,
            filter: "verified",
            icon: CheckCircle2,
        },
        {
            label: "Unverified",
            value: dashboardData.unverified,
            filter: "unverified",
            icon: ShieldQuestion,
        },
    ];


    const statsLoading = loadingDashboard;


    return (
        <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Summary cards */}
                <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                    {statItems.map((item) => (
                        <StatCard
                            key={item.filter}
                            icon={item.icon}
                            label={item.label}
                            value={item.value}
                            loading={statsLoading}
                            active={activeFilter === item.filter}
                            onClick={() => setActiveFilter(item.filter)}
                        />
                    ))}
                </section>

                {/* Scan and upload */}
                <section className="grid gap-5 xl:grid-cols-2">
                    <ScanPanel
                        key={scannerKey}
                        onScan={handleScan}
                        scanning={scanning}
                    />

                    <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6">
                        <ScanLine className="mb-4 h-9 w-9 text-[#a20000]" />

                        <h2 className="text-xl font-bold">
                            Scan and upload visiting cards
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Upload an image or scan a visiting card using
                            your camera. The card will be processed
                            automatically. You can track its progress in
                            Pending Cards.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/executive/pending")}
                            className="mt-5 self-start rounded-xl bg-[#a20000] px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
                        >
                            View Pending Cards
                        </button>
                    </div>
                </section>

                {/* Submission notification */}
                {submitted && (
                    <div
                        role="status"
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                    >
                        <p>
                            Your card was submitted for processing.
                            Please check Pending Cards.
                        </p>

                        <button
                            type="button"
                            className="font-semibold underline"
                            onClick={() => navigate("/executive/pending")}
                        >
                            View Pending
                        </button>
                    </div>
                )}

                {pendingError && (
                    <div
                        role="alert"
                        className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800"
                    >
                        Pending cards: {pendingError}
                    </div>
                )}

            </div>
        </main>
    );
}