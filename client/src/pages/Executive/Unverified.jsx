
import React, { useCallback, useEffect, useState } from "react";
import {
  Download,
  Search,
  RefreshCw,
  Loader2,
  Pencil,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance";

const Unverified = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [editingLead, setEditingLead] = useState(null);
  const [rejectingLead, setRejectingLead] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    companyName: "",
    city: "",
    requirement: "",
    email: "",
    mobileNo: "",
  });

  const limit = 6;

  const fetchUnverifiedLeads = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/api/v1/executive/get/un-verified?pageNo=${page}&limit=${limit}`
      );

      const data = response.data?.formatLead || [];

      setHasNext(Boolean(response.data?.hasNext));
      setLeads(data.slice(0, limit));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch unverified leads"
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUnverifiedLeads();
  }, [fetchUnverifiedLeads]);

  const filteredLeads = leads.filter((lead) => {
    const query = search.trim().toLowerCase();

    return [
      lead.customerName,
      lead.companyName,
      lead.city,
      lead.mobileNo,
      lead.email,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });

  const handleSearch = (value) => {
    setSearch(value);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);

    setFormData({
      customerName: lead.customerName || "",
      companyName: lead.companyName || "",
      city: lead.city || "",
      requirement: lead.requirement || "",
      email: lead.email || "",
      mobileNo: lead.mobileNo || lead.mobileno || "",
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const updateCard = async (event) => {
    event.preventDefault();

    if (!editingLead?._id) {
      toast.error("Card ID is missing");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(
        `/api/v1/executive/update-card/${editingLead._id}`,
        {
          customerName: formData.customerName,
          companyName: formData.companyName,
          city: formData.city,
          requirement: formData.requirement,
          email: formData.email,
          mobileNo: formData.mobileNo,
        }
      );

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Failed to update card");
      }

      toast.success("Card updated successfully");
      setEditingLead(null);
      await fetchUnverifiedLeads();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update card"
      );
    } finally {
      setSaving(false);
    }
  };

  // IMPORTANT:
  // Replace these URLs/methods if your backend uses different
  // endpoints or expects a different request body.
  const updateCardStatus = async (lead, status, reason = "") => {
    if (!lead?._id) {
      toast.error("Card ID is missing");
      return;
    }

    try {
      setActionId(lead._id);

     const response = await api.post(`/api/v1/executive/change-status/${lead._id}`,
        {
          status,
          ...(reason ? { rejectionReason: reason } : null),
        }
      );

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Status update failed");
      }

      toast.success(
        status === "verified"
          ? "Card verified successfully"
          : "Card rejected successfully"
      );

      setRejectingLead(null);
      setRejectReason("");
      await fetchUnverifiedLeads();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update card status"
      );
    } finally {
      setActionId(null);
    }
  };

  // const downloadExcel = async () => {
  //   try {
  //     setDownloading(true);

  //     const response = await api.get("/api/v1/executive/excel", {
  //       responseType: "blob",
  //       params: {
  //         status: "un-verified",
  //       },
  //     });

  //     const fileUrl = window.URL.createObjectURL(
  //       new Blob([response.data])
  //     );

  //     const link = document.createElement("a");
  //     link.href = fileUrl;
  //     link.download = "unverified-leads.xlsx";
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();

  //     window.URL.revokeObjectURL(fileUrl);
  //     toast.success("Excel downloaded successfully");
  //   } catch (error) {
  //     toast.error("Failed to download Excel file");
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-100";

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Unverified Leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review, edit, verify, or reject visiting card details.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchUnverifiedLeads}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          {/* <button
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
          </button> */}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">S.No.</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Company</th>
                <th className="px-5 py-4 font-semibold">City</th>
                <th className="px-5 py-4 font-semibold">Mobile</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Added On</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-red-700" />
                    <p className="mt-2 text-sm text-slate-500">
                      Loading unverified leads...
                    </p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    {search
                      ? "No matching unverified leads found."
                      : "No unverified leads found."}
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
                      {lead.mobileNo || lead.mobileno || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {lead.email || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Unverified
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Modify card"
                          onClick={() => openEditModal(lead)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Modify
                        </button>

                        <button
                          type="button"
                          title="Verify card"
                          disabled={actionId === lead._id}
                          onClick={() =>
                            updateCardStatus(lead, "verified")
                          }
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {actionId === lead._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          Verify
                        </button>

                        <button
                          type="button"
                          title="Reject card"
                          disabled={actionId === lead._id}
                          onClick={() => {
                            setRejectingLead(lead);
                            setRejectReason("");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

      {/* Modify card modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Modify Card
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the visiting card details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingLead(null)}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={updateCard} className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    Customer Name
                  </span>
                  <input
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    Company Name
                  </span>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    City
                  </span>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className={inputClass}
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    Mobile Number
                  </span>
                  <input
                    name="mobileNo"
                    type="tel"
                    value={formData.mobileNo}
                    onChange={handleFormChange}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-700">
                    Requirement
                  </span>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleFormChange}
                    className={inputClass}
                    rows={3}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Reject Card
              </h2>
              <button
                type="button"
                onClick={() => setRejectingLead(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Rejecting: {rejectingLead.customerName || "Unnamed customer"}
            </p>

            <label className="mt-4 block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Rejection reason
              </span>
              <textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Enter why this card is being rejected..."
                rows={3}
                className={inputClass}
                required
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectingLead(null)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!rejectReason.trim() || actionId === rejectingLead._id}
                onClick={() =>
                  updateCardStatus(
                    rejectingLead,
                    "rejected",
                    rejectReason.trim()
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionId === rejectingLead._id && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Unverified;
