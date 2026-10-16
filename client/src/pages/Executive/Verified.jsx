import { useEffect, useState } from "react";
import { Download, Search, RefreshCw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance";

const Verified = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const limit = 6;

  const fetchVerifiedLeads = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/api/v1/executive/get-verified?pageNo=${page}&limit=${limit}`
      );

      const data = response.data?.lead || [];

      setHasNext(response?.data?.hasNext || false);
      setLeads(data.slice(0, limit));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch verified leads"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifiedLeads();
  }, [page]);

  const filteredLeads = leads.filter((lead) => {
    const query = search.toLowerCase();

    return (
      lead.customerName?.toLowerCase().includes(query) ||
      lead.companyName?.toLowerCase().includes(query) ||
      lead.city?.toLowerCase().includes(query) ||
      lead.mobileNo?.toString().toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query)
    );
  });

  const downloadExcel = async () => {
    try {
      setDownloading(true);

      const response = await api.get("/api/v1/executive/excel", {
        responseType: "blob",
      });

      const fileUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "verified-leads.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileUrl);
      toast.success("Excel downloaded successfully");
    } catch (error) {
      toast.error("Failed to download Excel file");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Verified Leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage your verified visiting card records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchVerifiedLeads}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={downloadExcel}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Downloading..." : "Download Excel"}
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">S.No.</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Company</th>
                <th className="px-5 py-4 font-semibold">City</th>
                <th className="px-5 py-4 font-semibold">Mobile</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Verified On</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-red-700" />
                    <p className="mt-2 text-sm text-slate-500">
                      Loading verified leads...
                    </p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    {search
                      ? "No matching verified leads found."
                      : "No verified leads found."}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={lead._id || index}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {lead.customerName || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {lead.companyName || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {lead.city || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {lead.mobileNo || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {lead.email || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {lead.updatedAt
                        ? new Date(lead.updatedAt).toLocaleDateString()
                        : lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString()
                          : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{page}</span>
            {" · "}
            Showing {filteredLeads.length} of {leads.length} records on this page
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={!hasNext || loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verified;