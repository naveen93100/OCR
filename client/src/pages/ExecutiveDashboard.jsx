import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle2, Clock3, Download, History, LayoutDashboard, Layers,
  Loader2, LogOut, RefreshCw, ScanLine, ShieldQuestion, XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import ScanPanel from "../components/executive/ScanPanel";
import api from "../api/axiosInstance";

// Uses the existing API contract: { success, history: [] } and { success }.
// scan-single must persist/queue the card server-side. Pending uses its own endpoint.
// Pending response adapter below accepts pendingCards, cards, or data arrays.
// ScanPanel must call onScan(file) for both uploads and camera captures.
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const REFRESH_MS = 10000;
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "history", label: "History", icon: History },
  { id: "pending", label: "Pending", icon: Clock3 },
  { id: "unverified", label: "Unverified", icon: ShieldQuestion },
  { id: "verified", label: "Verified", icon: CheckCircle2 },
  { id: "rejected", label: "Rejected", icon: XCircle },
];
const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  unverified: "bg-blue-50 text-blue-700",
  verified: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
};
const normalizeStatus = (status) =>
  String(status || "unknown").trim().toLowerCase().replace(/[\s_-]/g, "");
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
};
const clearSession = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};
const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-IN");
};

function StatCard({ icon: Icon, label, value, loading, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-red-300 focus-visible:outline-red-700">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <Icon className="h-5 w-5 text-red-700" />
      </div>
      <p className="mt-3 text-3xl font-bold">{loading ? "…" : value}</p>
    </button>
  );
}

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const user = useMemo(getUser, []);
  const [activeView, setActiveView] = useState("dashboard");
  const [cards, setCards] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [refreshingPending, setRefreshingPending] = useState(false);
  const [pendingError, setPendingError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const scanBusy = useRef(false);
  const historyController = useRef(null);
  const pendingController = useRef(null);
  const scanController = useRef(null);
  const mounted = useRef(false);
  const authExpired = useRef(false);
  const displayName = user?.name || user?.userId || "Executive";

  const handleAuthError = useCallback((err) => {
    if (err?.response?.status !== 401) return false;
    if (!authExpired.current) {
      authExpired.current = true;
      clearSession();
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true });
    }
    return true;
  }, [navigate]);

  const getHistory = useCallback(async ({ silent = false } = {}) => {
    if (authExpired.current) return;
    // Cancel older reads so a stale response cannot overwrite newer history.
    historyController.current?.abort();
    const controller = new AbortController();
    historyController.current = controller;
    if (!silent) setRefreshing(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/executive/history`, {
        withCredentials: true, signal: controller.signal,
      });
      if (!data?.success || !Array.isArray(data.history)) {
        throw new Error(data?.message || "Invalid history response");
      }
      if (!mounted.current || controller.signal.aborted) return;
      setCards([...data.history].sort((a, b) =>
        (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)));
      setHistoryError("");
    } catch (err) {
      if (controller.signal.aborted || !mounted.current) return;
      if (handleAuthError(err)) return;
      const message = err?.response?.data?.message || err.message || "Could not load cards";
      setHistoryError(message);
      if (!silent) toast.error(message);
    } finally {
      if (mounted.current && historyController.current === controller) {
        setLoadingHistory(false);
        setRefreshing(false);
        historyController.current = null;
      }
    }
  }, [handleAuthError]);

  const getPendingCards = useCallback(async ({ silent = false } = {}) => {
    if (authExpired.current) return;
    pendingController.current?.abort();
    const controller = new AbortController();
    pendingController.current = controller;
    if (!silent) setRefreshingPending(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/v1/executive/pending-cards`, {
        withCredentials: true, signal: controller.signal,
      });
      // Adjust this adapter if your backend uses a different response envelope.
      const rows = [data?.pendingCards, data?.cards, data?.data,
        data?.data?.pendingCards, data?.data?.cards, data].find(Array.isArray);
      if (data?.success === false || !rows || rows.some((row) => !row || typeof row !== "object" || Array.isArray(row))) {
        throw new Error(data?.message || "Invalid pending-cards response");
      }
      if (!mounted.current || controller.signal.aborted) return;
      setPendingCards(rows.map((card) => ({ ...card, status: card.status || "pending" }))
        .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)));
      setPendingError("");
    } catch (err) {
      if (controller.signal.aborted || !mounted.current || handleAuthError(err)) return;
      const message = err?.response?.data?.message || err.message || "Could not load pending cards";
      setPendingError(message);
      if (!silent) toast.error(message);
    } finally {
      if (mounted.current && pendingController.current === controller) {
        setLoadingPending(false);
        setRefreshingPending(false);
        pendingController.current = null;
      }
    }
  }, [handleAuthError]);

  useEffect(() => {
    mounted.current = true;
    if (!user || !localStorage.getItem("access_token")) {
      navigate("/login", { replace: true });
      return () => { mounted.current = false; };
    }
    void getHistory();
    void getPendingCards();
    // Poll even when no pending card is visible yet (queue visibility may lag).
    const refresh = () => {
      if (document.visibilityState === "visible" && !historyController.current) {
        void getHistory({ silent: true });
      }
      if (document.visibilityState === "visible" && !pendingController.current) {
        void getPendingCards({ silent: true });
      }
    };
    const interval = window.setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      mounted.current = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      historyController.current?.abort();
      pendingController.current?.abort();
      scanController.current?.abort();
    };
  }, [user, navigate, getHistory, getPendingCards]);

  useEffect(() => {
    if (activeView === "pending" && user && localStorage.getItem("access_token") && !pendingController.current) {
      void getPendingCards();
    }
  }, [activeView, user, getPendingCards]);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, unverified: 0, verified: 0, rejected: 0 };
    cards.forEach((card) => {
      const status = normalizeStatus(card.status);
      if (Object.prototype.hasOwnProperty.call(counts, status)) counts[status] += 1;
    });
    counts.pending = pendingCards.length;
    return counts;
  }, [cards, pendingCards]);
  const visibleCards = useMemo(() => {
    if (activeView === "dashboard") return cards.slice(0, 10);
    if (activeView === "history") return cards;
    if (activeView === "pending") return pendingCards;
    return cards.filter((card) => normalizeStatus(card.status) === activeView);
  }, [cards, pendingCards, activeView]);
  const viewLoading = activeView === "pending" ? loadingPending : loadingHistory;
  const viewRefreshing = activeView === "pending" ? refreshingPending : refreshing;
  const viewError = activeView === "pending" ? pendingError : historyError;
  const refreshView = () => {
    if (activeView === "pending") void getPendingCards();
    else {
      void getHistory();
      if (activeView === "dashboard") void getPendingCards();
    }
  };
  const viewLabel = NAV_ITEMS.find((item) => item.id === activeView)?.label;

  const handleScan = async (file) => {
    if (scanBusy.current || authExpired.current) return;
    if (!(file instanceof Blob) || !file.size) {
      toast.error("Please select or capture a card image.");
      return;
    }
    scanBusy.current = true;
    setScanning(true);
    const controller = new AbortController();
    scanController.current = controller;
    try {
      const formData = new FormData();
      formData.append("images", file);
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/executive/scan-single`, formData,
        { withCredentials: true, signal: controller.signal },
      );
      if (!data?.success) throw new Error(data?.message || "Card submission failed");
      if (!mounted.current) return;
      // No draft, CardForm, or create-lead call in this flow.
      setSubmitted(true);
      setScannerKey((key) => key + 1);
      toast.success("Your card is processing. Please check Pending Cards.", { duration: 5000 });
      void getHistory({ silent: true });
      void getPendingCards({ silent: true });
    } catch (err) {
      if (controller.signal.aborted || !mounted.current || handleAuthError(err)) return;
      toast.error(err?.response?.data?.message || err.message || "Could not submit card");
    } finally {
      scanBusy.current = false;
      if (mounted.current) setScanning(false);
    }
  };

  const handleDownload = async () => {
    if (exporting || !cards.length) return;
    setExporting(true);
    try {
      // The existing Excel endpoint exports all leads, regardless of active view.
      const response = await api.get(`${BASE_URL}/api/v1/executive/excel`, {
        responseType: "blob", withCredentials: true,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "executive-leads.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Excel downloaded successfully");
    } catch (err) {
      if (!handleAuthError(err)) toast.error("Could not export Excel. Please try again.");
    } finally {
      if (mounted.current) setExporting(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.post(`${BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
      clearSession();
      navigate("/login", { replace: true });
    } catch (err) {
      if (!handleAuthError(err)) toast.error("Logout failed. Please try again.");
    } finally {
      if (mounted.current) setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <span className="rounded-xl bg-red-50 p-3 text-red-700"><ScanLine className="h-6 w-6" /></span>
          <div><h1 className="font-bold">OCR Gautam Solar</h1><p className="text-xs text-slate-500">Executive Console</p></div>
        </div>
        <nav aria-label="Executive navigation" className="flex gap-2 overflow-x-auto p-3 lg:flex-1 lg:flex-col">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setActiveView(id)}
              aria-current={activeView === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeView === id ? "bg-[#a20000] text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Icon className="h-5 w-5" /><span>{label}</span>
              {id !== "dashboard" && <span className="ml-auto rounded-full bg-black/5 px-2 py-0.5 text-xs">{(id === "pending" ? loadingPending : loadingHistory) ? "…" : id === "history" ? cards.length : statusCounts[id]}</span>}
            </button>
          ))}
        </nav>
        <div className="hidden border-t border-slate-100 p-5 text-xs text-slate-400 lg:block">Card scanning &amp; tracking</div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div><h2 className="text-lg font-bold">{viewLabel}</h2><p className="text-xs text-slate-500">Hello, {displayName}</p></div>
          <button type="button" onClick={handleLogout} disabled={loggingOut || scanning}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:opacity-50">
            {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Logout
          </button>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          {activeView === "dashboard" && <>
            <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
              <StatCard icon={Layers} label="Total Cards" value={cards.length} loading={loadingHistory} onClick={() => setActiveView("history")} />
              {NAV_ITEMS.slice(2).map(({ id, label, icon }) => <StatCard key={id} icon={icon} label={label} value={statusCounts[id]} loading={id === "pending" ? loadingPending : loadingHistory} onClick={() => setActiveView(id)} />)}
            </section>
            <section className="grid gap-5 xl:grid-cols-2">
              <ScanPanel key={scannerKey} onScan={handleScan} scanning={scanning} />
              <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6">
                <Clock3 className="mb-4 h-9 w-9 text-red-700" />
                <h3 className="text-xl font-bold">Scan now. Track processing here.</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">Upload or scan a visiting card to submit it for processing. Check Pending Cards for its progress. Cards are grouped by the status returned by the server.</p>
                <button type="button" onClick={() => setActiveView("pending")} className="mt-5 self-start rounded-xl bg-[#a20000] px-4 py-3 text-sm font-semibold text-white">View Pending Cards</button>
              </div>
            </section>
          </>}

          {activeView === "dashboard" && pendingError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Pending cards: {pendingError}. The pending count may be out of date. <button type="button" onClick={() => void getPendingCards()} className="underline">Retry</button></p>}

          {submitted && <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p>Your card was submitted for processing. Please check Pending Cards.</p>
            <div className="flex gap-4"><button type="button" className="font-semibold underline" onClick={() => setActiveView("pending")}>View Pending</button><button type="button" aria-label="Dismiss submission notification" onClick={() => setSubmitted(false)}>Dismiss</button></div>
          </div>}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
              <div>
                <h3 className="text-lg font-bold">{activeView === "dashboard" ? "Recent Cards" : activeView === "history" ? "Card History" : `${viewLabel} Cards`}</h3>
                <p className="mt-1 text-xs text-slate-500">{activeView === "dashboard" ? "Latest 10 cards. " : ""}Automatically refreshes every 10 seconds while this tab is visible.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={refreshView} disabled={viewRefreshing || viewLoading} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${viewRefreshing ? "animate-spin" : ""}`} />Refresh</button>
                <button type="button" onClick={handleDownload} disabled={exporting || loadingHistory || !cards.length} className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50">{exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}Export All</button>
              </div>
            </div>
            {viewError && <p role="alert" className="bg-red-50 px-5 py-3 text-sm text-red-700">{viewError}. Displayed cards may be out of date. Use Refresh to retry.</p>}
            <div className="overflow-x-auto" aria-busy={viewLoading || viewRefreshing}>
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr>{["Customer", "Company", "City", "Mobile", "Email", "Status", "Created"].map((heading) => <th key={heading} scope="col" className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {viewLoading ? <tr><td colSpan={7} className="p-10 text-center text-slate-500">Loading cards…</td></tr> : visibleCards.length === 0 ? <tr><td colSpan={7} className="p-10 text-center text-slate-500">{viewError ? "Cards could not be loaded. Please refresh." : activeView === "pending" ? "No pending cards yet. Submitted cards may take a moment to appear." : "No cards found."}</td></tr> : visibleCards.map((card, index) => {
                    const status = normalizeStatus(card.status);
                    const label = NAV_ITEMS.find((item) => item.id === status)?.label || card.status || "Unknown";
                    return <tr key={card._id || card.id || index} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium">{card.customerName || "—"}</td>
                      <td className="px-4 py-4">{card.companyName || "—"}</td>
                      <td className="px-4 py-4">{card.city || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-4">{card.mobileNo || card.mobileno || "—"}</td>
                      <td className="px-4 py-4">{card.email || "—"}</td>
                      <td className="px-4 py-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"}`}>{label}</span></td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">{formatDate(card.createdAt)}</td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
