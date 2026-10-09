import { useState } from "react";
import {
    Briefcase,
    Building2,
    Globe,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

const FIELDS = [
    {
        name: "customerName",
        label: "Full name",
        icon: User,
        type: "text",
        inputMode: "text",
    },
    {
        name: "designation",
        label: "Designation",
        icon: Briefcase,
        type: "text",
        inputMode: "text",
    },
    {
        name: "companyName",
        label: "Company",
        icon: Building2,
        type: "text",
        inputMode: "text",
    },
    {
        name: "mobileNo",
        label: "Phone",
        icon: Phone,
        type: "tel",
        inputMode: "tel",
    },
    {
        name: "email",
        label: "Email",
        icon: Mail,
        type: "email",
        inputMode: "email",
    },
    {
        name: "website",
        label: "Website",
        icon: Globe,
        type: "text",
        inputMode: "url",
    },
];

const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder-slate-400 outline-none transition hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 sm:text-sm";
const labelCls =
    "block text-xs font-semibold uppercase tracking-wider text-slate-500";

const CardForm = ({ initial, onSave, onDiscard, saving }) => {
    const [form, setForm] = useState({
        customerName: "",
        designation: "",
        companyName: "",
        mobileNo: "",
        email: "",
        website: "",
        city: "",
        requirement: "",
        ...initial,
    });

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const { scanId, ...payload } = form; // scanId is UI-only
        onSave(payload);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:p-6"
        >
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-linear-to-r from-transparent via-red-500 to-transparent" />

            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Extracted details
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Check for OCR mistakes before saving.
                    </p>
                </div>
                <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-600">
                    Review
                </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {FIELDS.map(({ name, label, icon: Icon, type, inputMode }) => (
                    <div key={name} className="space-y-2">
                        <label htmlFor={name} className={labelCls}>
                            {label}
                        </label>
                        <div className="group relative">
                            <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-red-500" />
                            <input
                                id={name}
                                name={name}
                                type={type}
                                inputMode={inputMode}
                                value={form[name] || ""}
                                onChange={handleChange}
                                className={inputCls}
                            />
                        </div>
                    </div>
                ))}

                {/* city — required by backend createLead */}
                <div className="space-y-2">
                    <label htmlFor="city" className={labelCls}>
                        City
                    </label>
                    <div className="group relative">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-red-500" />
                        <input
                            id="city"
                            name="city"
                            type="text"
                            inputMode="text"
                            value={form.city || ""}
                            onChange={handleChange}
                            className={inputCls}
                        />
                    </div>
                </div>

                {/* requirement — full width */}
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="requirement" className={labelCls}>
                        Requirement
                    </label>
                    <div className="group relative">
                        <Building2 className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400 transition group-focus-within:text-red-500" />
                        <textarea
                            id="requirement"
                            name="requirement"
                            rows={2}
                            value={form.requirement || ""}
                            onChange={handleChange}
                            className={`${inputCls} resize-none`}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onDiscard}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20"
                >
                    Discard
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save contact"}
                </button>
            </div>
        </form>
    );
};

export default CardForm;
