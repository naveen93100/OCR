import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
const ROLES = [
    { value: "executive", label: "Executive" },
    { value: "super_admin", label: "Super Admin" },
];

const ExecutiveModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        name: "",
        role: "executive",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && !saving) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, saving]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const name = form.name.trim();
        if (!name) return toast.error("Name is required");
        if (!form.role) return toast.error("Role is required");
        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setSaving(true);

            await axios.post(
                `${BASE_URL}/api/v1/admin/create-marketing-person`,
                { name, role: form.role, password: form.password },
            );
            toast.success("Executive added");
            onSuccess?.({ name, role: form.role });
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onClick={() => !saving && onClose()}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Add Executive"
            >
                <div className="flex items-center justify-between border-b border-slate-200 p-5">
                    <h3 className="text-base font-semibold text-slate-900">
                        Add Executive
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={saving}
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
                            autoFocus
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
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
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
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Add Executive"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExecutiveModal;
