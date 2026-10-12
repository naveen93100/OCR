import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import clsx from "clsx";
import { UserPlus, Pencil, X, Eye, EyeOff } from "lucide-react";

const ROLES = [
    { value: "executive", label: "Executive" },
    { value: "super_admin", label: "Super Admin" },
];

// TODO: replace with data from backend (GET /executives)
const INITIAL_EXECUTIVES = [
    { _id: "1", name: "Rahul Sharma", role: "executive", isActive: true },
    { _id: "2", name: "Priya Verma", role: "executive", isActive: true },
    { _id: "3", name: "Amit Khanna", role: "executive", isActive: false },
];

const EMPTY_FORM = { name: "", role: "executive", password: "" };

const AddExecutive = () => {
    const { searchQuery = "" } = useOutletContext() || {};

    const [executives, setExecutives] = useState(INITIAL_EXECUTIVES);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = add mode
    const [form, setForm] = useState(EMPTY_FORM);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    const isEdit = editingId !== null;

    const filtered = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return executives;
        return executives.filter((e) =>
            `${e.name} ${e.role}`.toLowerCase().includes(q),
        );
    }, [executives, searchQuery]);

    const openAdd = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setShowPassword(false);
        setModalOpen(true);
    };

    const openEdit = (exec) => {
        setEditingId(exec._id);
        setForm({ name: exec.name, role: exec.role, password: "" });
        setShowPassword(false);
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = form.name.trim();
        if (!name) return toast.error("Name is required");
        if (!form.role) return toast.error("Role is required");
        if (!isEdit && form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        if (isEdit && form.password && form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setSaving(true);

            if (isEdit) {
                // TODO: call backend update API (PUT /executives/:id)
                // password is optional on edit - send only if filled
                setExecutives((prev) =>
                    prev.map((x) =>
                        x._id === editingId
                            ? { ...x, name, role: form.role }
                            : x,
                    ),
                );
                toast.success("Executive updated");
            } else {
                // TODO: call backend create API (POST /executives)
                setExecutives((prev) => [
                    {
                        _id: String(Date.now()),
                        name,
                        role: form.role,
                        isActive: true,
                    },
                    ...prev,
                ]);
                toast.success("Executive added");
            }

            setModalOpen(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = (exec) => {
        // TODO: call backend status API (PATCH /executives/:id/status)
        setExecutives((prev) =>
            prev.map((x) =>
                x._id === exec._id ? { ...x, isActive: !x.isActive } : x,
            ),
        );
        toast.success(
            `${exec.name} ${exec.isActive ? "deactivated" : "activated"}`,
        );
    };

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Executives
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Add and manage your executives.
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
                >
                    <UserPlus className="h-4 w-4" />
                    Add Executive
                </button>
            </div>

            {/* Executive data */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                    <h2 className="text-base font-semibold text-slate-900">
                        Executive List
                    </h2>
                    <p className="text-xs text-slate-500">
                        {filtered.length} executive
                        {filtered.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                {filtered.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        No executives found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/60 text-left">
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Role
                                    </th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((exec) => (
                                    <tr
                                        key={exec._id}
                                        className="border-b border-slate-100 transition hover:bg-red-50/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-red-600 to-red-400 text-xs font-bold text-white">
                                                    {(exec.name ||
                                                        "U")[0].toUpperCase()}
                                                </div>
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {exec.name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                                                {exec.role.replaceAll("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={exec.isActive}
                                                    aria-label={`Toggle ${exec.name}`}
                                                    onClick={() =>
                                                        handleToggle(exec)
                                                    }
                                                    className={clsx(
                                                        "relative h-6 w-11 shrink-0 rounded-full transition",
                                                        exec.isActive
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-300",
                                                    )}
                                                >
                                                    <span
                                                        className={clsx(
                                                            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                                                            exec.isActive
                                                                ? "translate-x-5"
                                                                : "translate-x-0",
                                                        )}
                                                    />
                                                </button>
                                                <span
                                                    className={clsx(
                                                        "text-xs font-medium",
                                                        exec.isActive
                                                            ? "text-emerald-600"
                                                            : "text-slate-400",
                                                    )}
                                                >
                                                    {exec.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() =>
                                                        openEdit(exec)
                                                    }
                                                    title="Edit"
                                                    aria-label={`Edit ${exec.name}`}
                                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add / Edit modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                {isEdit ? "Update Executive" : "Add Executive"}
                            </h3>
                            <button
                                onClick={closeModal}
                                aria-label="Close"
                                className="text-slate-400 transition hover:text-slate-900"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-5">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                    Password
                                    {isEdit && (
                                        <span className="ml-1 font-normal text-slate-400">
                                            (leave empty to keep current)
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                        aria-label="Toggle password visibility"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : isEdit
                                          ? "Update"
                                          : "Add Executive"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AddExecutive;
