// import { useState } from "react";
// import {
//     Briefcase,
//     Building2,
//     Globe,
//     Mail,
//     MapPin,
//     Phone,
//     User,
// } from "lucide-react";

// const FIELDS = [
//     {
//         label: "customerName",
//         // label: "Full name",
//         icon: User,
//         type: "text",
//         inputMode: "text",
//     },

//     {
//         label: "companyName",
//         // label: "Company",
//         icon: Building2,
//         type: "text",
//         inputMode: "text",
//     },
//     {
//         name: "mobileNo",
//         label: "Phone",
//         icon: Phone,
//         type: "tel",
//         inputMode: "tel",
//     },
//     {
//         name: "email",
//         label: "Email",
//         icon: Mail,
//         type: "email",
//         inputMode: "email",
//     },
// ];

// const inputCls =
//     "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder-slate-400 outline-none transition hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 sm:text-sm";
// const labelCls =
//     "block text-xs font-semibold uppercase tracking-wider text-slate-500";

// const CardForm = ({ initial, onSave, onDiscard, saving }) => {
//     const [form, setForm] = useState({
//         customerName: "",

//         companyName: "",
//         mobileNo: "",
//         email: "",

//         city: "",
//         requirement: "",
//         ...initial,
//     });

//     const handleChange = (e) =>
//         setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const { scanId, ...payload } = form; // scanId is UI-only
//         onSave(payload);
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 sm:p-6"
//         >
//             <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-linear-to-r from-transparent via-red-500 to-transparent" />

//             <div className="flex items-start justify-between gap-3">
//                 <div>
//                     <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                         Extracted details
//                     </h2>
//                     <p className="mt-1 text-xs text-slate-400">
//                         Check for OCR mistakes before saving.
//                     </p>
//                 </div>
//                 <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-600">
//                     Review
//                 </span>
//             </div>

//             <div className="mt-5 grid gap-4 sm:grid-cols-2">
//                 {FIELDS.map(({ name, label, icon: Icon, type, inputMode }) => (
//                     <div key={name} className="space-y-2">
//                         <label htmlFor={name} className={labelCls}>
//                             {label}
//                         </label>
//                         <div className="group relative">
//                             <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-red-500" />
//                             <input
//                                 id={name}
//                                 name={name}
//                                 type={type}
//                                 inputMode={inputMode}
//                                 value={form[name] || ""}
//                                 onChange={handleChange}
//                                 className={inputCls}
//                             />
//                         </div>
//                     </div>
//                 ))}

//                 {/* city — required by backend createLead */}
//                 <div className="space-y-2">
//                     <label htmlFor="city" className={labelCls}>
//                         City
//                     </label>
//                     <div className="group relative">
//                         <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition group-focus-within:text-red-500" />
//                         <input
//                             id="city"
//                             name="city"
//                             type="text"
//                             inputMode="text"
//                             value={form.city || ""}
//                             onChange={handleChange}
//                             className={inputCls}
//                         />
//                     </div>
//                 </div>

//                 {/* requirement — full width */}
//                 <div className="space-y-2 sm:col-span-2">
//                     <label htmlFor="requirement" className={labelCls}>
//                         Requirement
//                     </label>
//                     <div className="group relative">
//                         <Building2 className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400 transition group-focus-within:text-red-500" />
//                         <textarea
//                             id="requirement"
//                             name="requirement"
//                             rows={2}
//                             value={form.requirement || ""}
//                             onChange={handleChange}
//                             className={`${inputCls} resize-none`}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
//                 <button
//                     type="button"
//                     onClick={onDiscard}
//                     className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20"
//                 >
//                     Discard
//                 </button>
//                 <button
//                     type="submit"
//                     disabled={saving}
//                     className="rounded-xl bg-red-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                     {saving ? "Saving..." : "Save contact"}
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default CardForm;


import { useState } from "react";
import clsx from "clsx";
import {
    AlertCircle,
    Briefcase,
    Building2,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react";

const FIELDS = [
    {
        name: "customerName",
        label: "Full Name",
        icon: User,
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
        required: true,
    },
    {
        name: "email",
        label: "Email",
        icon: Mail,
        type: "email",
        inputMode: "email",
    },
];

/* validation order = visual order (so first error gets focus) */
const VALIDATE_ORDER = ["mobileNo", "email", "city"];

const labelCls =
    "block text-xs font-semibold uppercase tracking-wider text-slate-500";

const baseInput =
    "w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-base text-slate-900 placeholder-slate-400 outline-none transition sm:text-sm";

const inputCls = (hasError) =>
    clsx(
        baseInput,
        hasError
            ? "border-red-400 ring-4 ring-red-500/15 focus:border-red-500 focus:ring-red-500/25"
            : "border-slate-200 hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10",
    );

const cleanMobile = (v = "") => {
    let d = String(v).replace(/\D/g, "");
    if (d.length > 10 && d.startsWith("91")) d = d.slice(2);
    if (d.length > 10 && d.startsWith("0")) d = d.slice(1);
    return d.slice(0, 10);
};

const CardForm = ({
    initial,
    onSave,
    onDiscard,
    saving,
    serverErrors = {},
    onFieldChange, // optional: parent clears its server error for this field
}) => {
    const [form, setForm] = useState({
        customerName: "",
        companyName: "",
        mobileNo: "",
        email: "",
        city: "",
        requirement: "",
        ...initial,
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /* ---- field rules (match backend) ---- */
    const validateField = (name, value) => {
        const v = String(value ?? "").trim();

        switch (name) {
            case "city":
                if (!v) return "City is required";
                return "";

            case "mobileNo": {
                if (!v) return "Mobile number is required";
                const digits = cleanMobile(v);
                if (digits.length !== 10)
                    return "Enter a valid 10-digit number";
                if (!/^[6-9]/.test(digits))
                    return "Indian mobile numbers start with 6-9";
                return "";
            }

            case "email":
                if (!v) return ""; // optional
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
                    return "Enter a valid email address";
                return "";

            // customerName, companyName, requirement → all optional
            default:
                return "";
        }
    };

    const validateAll = () => {
        const next = {};
        VALIDATE_ORDER.forEach((name) => {
            const err = validateField(name, form[name]);
            if (err) next[name] = err;
        });
        return next;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextValue = name === "mobileNo" ? cleanMobile(value) : value;

        setForm((p) => ({ ...p, [name]: nextValue }));
        onFieldChange?.(name); // drop stale server error while user edits

        if (touched[name]) {
            setErrors((p) => ({
                ...p,
                [name]: validateField(name, nextValue),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((p) => ({ ...p, [name]: true }));
        setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (saving) return;

        const next = validateAll();

        if (Object.keys(next).length > 0) {
            setErrors(next);
            setTouched(
                Object.keys(next).reduce(
                    (acc, k) => ({ ...acc, [k]: true }),
                    {},
                ),
            );
            document.getElementById(Object.keys(next)[0])?.focus();
            return;
        }

        // eslint-disable-next-line no-unused-vars
        const { scanId, ...rest } = form;
        const payload = Object.fromEntries(
            Object.entries(rest).map(([k, v]) => [
                k,
                typeof v === "string" ? v.trim() : v,
            ]),
        );
        payload.mobileNo = cleanMobile(payload.mobileNo);
        onSave(payload);
    };

    /* merge server-side field errors from parent */
    const allErrors = { ...errors, ...serverErrors };

    const renderError = (name) =>
        allErrors[name] ? (
            <p
                id={`${name}-error`}
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
                <AlertCircle className="h-3.5 w-3.5" />
                {allErrors[name]}
            </p>
        ) : null;

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
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
                {FIELDS.map(
                    ({
                        name,
                        label,
                        icon: Icon,
                        type,
                        inputMode,
                        required,
                    }) => {
                        const hasError = Boolean(allErrors[name]);
                        return (
                            <div key={name} className="space-y-2">
                                <label htmlFor={name} className={labelCls}>
                                    {label}
                                    {required && (
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    )}
                                </label>
                                <div className="group relative">
                                    <Icon
                                        className={clsx(
                                            "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition",
                                            hasError
                                                ? "text-red-500"
                                                : "text-slate-400 group-focus-within:text-red-500",
                                        )}
                                    />
                                    <input
                                        id={name}
                                        name={name}
                                        type={type}
                                        inputMode={inputMode}
                                        value={form[name] || ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-invalid={hasError}
                                        aria-describedby={
                                            hasError
                                                ? `${name}-error`
                                                : undefined
                                        }
                                        className={inputCls(hasError)}
                                    />
                                </div>
                                {renderError(name)}
                            </div>
                        );
                    },
                )}

                {/* City — required */}
                <div className="space-y-2">
                    <label htmlFor="city" className={labelCls}>
                        City
                        <span className="ml-1 text-red-500">*</span>
                    </label>
                    <div className="group relative">
                        <MapPin
                            className={clsx(
                                "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition",
                                allErrors.city
                                    ? "text-red-500"
                                    : "text-slate-400 group-focus-within:text-red-500",
                            )}
                        />
                        <input
                            id="city"
                            name="city"
                            type="text"
                            inputMode="text"
                            value={form.city || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(allErrors.city)}
                            aria-describedby={
                                allErrors.city ? "city-error" : undefined
                            }
                            className={inputCls(Boolean(allErrors.city))}
                        />
                    </div>
                    {renderError("city")}
                </div>

                {/* Requirement — full width */}
                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="requirement" className={labelCls}>
                        Requirement
                    </label>
                    <div className="group relative">
                        <Briefcase className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400 transition group-focus-within:text-red-500" />
                        <textarea
                            id="requirement"
                            name="requirement"
                            rows={2}
                            value={form.requirement || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={clsx(inputCls(false), "resize-none")}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onDiscard}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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