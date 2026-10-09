// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ROLE_HOME } from "../routes/RoleRedirect";
// import {
//     ArrowRight,
//     Eye,
//     EyeOff,
//     Loader2,
//     Lock,
//     ScanLine,
//     Shield,
//     ShieldCheck,
//     Zap,
//     FileText,
//     User,
//     TriangleAlert,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import clsx from "clsx";
// import { useAuth } from "../context/AuthContext";

// /* ------------------------------------------------------------------ */
// /* Reusable pieces                                                     */
// /* ------------------------------------------------------------------ */

// const Logo = ({ dark = false, className = "" }) => (
//     <div className={clsx("flex items-center gap-3", className)}>
//         <div className="relative">
//             <div className="absolute inset-0 rounded-xl bg-red-500/40 blur-lg" />
//             <div
//                 className={clsx(
//                     "relative flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm sm:h-11 sm:w-11",
//                     dark
//                         ? "border-white/15 bg-white/10 backdrop-blur"
//                         : "border-red-200 bg-white",
//                 )}
//             >
//                 <ScanLine
//                     className={clsx(
//                         "h-5 w-5 sm:h-6 sm:w-6",
//                         dark ? "text-red-400" : "text-red-600",
//                     )}
//                 />
//             </div>
//         </div>
//         <span
//             className={clsx(
//                 "text-xl font-bold tracking-tight sm:text-2xl",
//                 dark ? "text-white" : "text-slate-900",
//             )}
//         >
//             OCR<span className="text-red-500">.</span>dev
//         </span>
//     </div>
// );

// const Field = ({ id, label, icon: Icon, error, right, hint, ...props }) => (
//     <div>
//         <div className="mb-1.5 flex items-center justify-between sm:mb-2">
//             <label
//                 htmlFor={id}
//                 className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
//             >
//                 {label}
//             </label>
//         </div>

//         <div
//             className={clsx(
//                 "group relative flex items-center rounded-xl border bg-white transition",
//                 "focus-within:ring-4",
//                 error
//                     ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/10"
//                     : "border-slate-200 hover:border-slate-300 focus-within:border-red-500 focus-within:ring-red-500/10",
//             )}
//         >
//             <span
//                 className={clsx(
//                     "flex h-12 w-11 shrink-0 items-center justify-center sm:w-12",
//                     error
//                         ? "text-red-500"
//                         : "text-slate-400 group-focus-within:text-red-500",
//                 )}
//             >
//                 <Icon className="h-4 w-4" strokeWidth={2} />
//             </span>

//             <input
//                 id={id}
//                 name={id}
//                 aria-invalid={!!error}
//                 aria-describedby={
//                     error ? `${id}-error` : hint ? `${id}-hint` : undefined
//                 }
//                 className={clsx(
//                     // text-base on mobile prevents iOS zoom on focus
//                     "h-12 w-full min-w-0 bg-transparent pr-3 text-base text-slate-900 outline-none sm:text-sm",
//                     "placeholder:font-normal placeholder:text-slate-400",
//                 )}
//                 {...props}
//             />

//             {right && (
//                 <span className="flex h-12 w-11 shrink-0 items-center justify-center sm:w-12">
//                     {right}
//                 </span>
//             )}
//         </div>

//         {error ? (
//             <p
//                 id={`${id}-error`}
//                 role="alert"
//                 className="mt-1.5 text-xs font-medium text-red-500"
//             >
//                 {error}
//             </p>
//         ) : hint ? (
//             <p
//                 id={`${id}-hint`}
//                 className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-600"
//             >
//                 <TriangleAlert className="h-3.5 w-3.5" />
//                 {hint}
//             </p>
//         ) : null}
//     </div>
// );

// const features = [
//     {
//         icon: Zap,
//         title: "Lightning-fast extraction",
//         text: "Turn documents into structured data in seconds.",
//     },
//     {
//         icon: FileText,
//         title: "Every format, one place",
//         text: "Invoices, IDs, forms and more — all handled together.",
//     },
//     {
//         icon: ShieldCheck,
//         title: "Enterprise-grade security",
//         text: "Your data stays encrypted, in transit and at rest.",
//     },
// ];

// /* ------------------------------------------------------------------ */
// /* Page                                                                */
// /* ------------------------------------------------------------------ */

// const Login = () => {
//     const { login, isAuthenticated, user } = useAuth();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [form, setForm] = useState({ userId: "", password: "" });
//     const [errors, setErrors] = useState({});
//     const [showPassword, setShowPassword] = useState(false);
//     const [capsLock, setCapsLock] = useState(false);
//     const [loading, setLoading] = useState(false);

//     // Single place for navigation: runs as soon as auth state is set
//     useEffect(() => {
//         if (!isAuthenticated) return;

//         const from = location.state?.from?.pathname;
//         const target =
//             (from && from !== "/login" ? from : null) ||
//             ROLE_HOME[user?.role] ||
//             "/";

//         navigate(target, { replace: true });
//     }, [isAuthenticated, user, navigate, location.state]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setForm((p) => ({ ...p, [name]: value }));
//         if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
//     };

//     const handleCaps = (e) => {
//         if (e.getModifierState) setCapsLock(e.getModifierState("CapsLock"));
//     };

//     const validate = () => {
//         const next = {};
//         if (!form.userId.trim()) next.userId = "User ID is required";
//         if (!form.password) next.password = "Password is required";
//         setErrors(next);
//         return !Object.keys(next).length;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (loading || !validate()) return;

//         try {
//             setLoading(true);
//             await login(form.userId.trim(), form.password);
//             toast.success("Logged in successfully");
//             // navigation handled by the useEffect above
//         } catch (err) {
//             toast.error(
//                 err.response?.data?.message ||
//                     err.message ||
//                     "Something went wrong.",
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.05fr_1fr]">
//             {/* ============ Brand panel (desktop / large tablet only) ============ */}
//             <aside className="relative hidden overflow-hidden bg-slate-950 lg:flex">
//                 <div
//                     className="pointer-events-none absolute inset-0 opacity-[0.07]"
//                     style={{
//                         backgroundImage:
//                             "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
//                         backgroundSize: "44px 44px",
//                     }}
//                 />
//                 <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-red-600/30 blur-[120px]" />
//                 <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-red-500/20 blur-[130px]" />

//                 <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
//                     <Logo dark />

//                     <div className="max-w-lg">
//                         <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
//                             <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
//                             Secure Access Portal
//                         </span>

//                         <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
//                             Welcome back.
//                             <br />
//                             <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
//                                 Let&apos;s get to work.
//                             </span>
//                         </h2>
//                         <p className="mt-4 text-base text-slate-400 xl:text-lg">
//                             Sign in to manage your documents, review extractions
//                             and keep your workflow moving.
//                         </p>

//                         <ul className="mt-10 space-y-5">
//                             {features.map(({ icon: Icon, title, text }) => (
//                                 <li
//                                     key={title}
//                                     className="flex items-start gap-4"
//                                 >
//                                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-red-400">
//                                         <Icon className="h-5 w-5" />
//                                     </span>
//                                     <div>
//                                         <p className="text-sm font-semibold text-white">
//                                             {title}
//                                         </p>
//                                         <p className="text-sm text-slate-400">
//                                             {text}
//                                         </p>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <p className="text-xs text-slate-500">
//                         © {new Date().getFullYear()} OCR.dev — All rights
//                         reserved.
//                     </p>
//                 </div>
//             </aside>

//             {/* ============ Form side ============ */}
//             <main className="relative flex min-h-screen flex-col overflow-hidden">
//                 <div
//                     className="pointer-events-none absolute inset-0 opacity-30 sm:opacity-40"
//                     style={{
//                         backgroundImage:
//                             "linear-gradient(rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)",
//                         backgroundSize: "48px 48px",
//                     }}
//                 />
//                 <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[80vw] max-w-[600px] -translate-x-1/2 rounded-full bg-red-500/10 blur-[100px] sm:h-96 sm:blur-[120px]" />
//                 <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-[70vw] max-w-[400px] rounded-full bg-red-600/10 blur-[80px] sm:h-72 sm:blur-[100px]" />

//                 {/* Mobile / tablet logo bar */}
//                 <header className="relative flex items-center justify-center px-4 pt-8 sm:pt-10 lg:hidden">
//                     <Logo />
//                 </header>

//                 {/* Centered form */}
//                 <div className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
//                     <div className="w-full max-w-sm sm:max-w-md">
//                         <div className="mb-6 text-center sm:mb-8 lg:text-left">
//                             <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 sm:text-xs lg:hidden">
//                                 Secure Access Portal
//                             </p>
//                             <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:mt-0">
//                                 Sign in to your account
//                             </h1>
//                             <p className="mt-2 text-sm text-slate-500">
//                                 Enter your credentials to continue.
//                             </p>
//                         </div>

//                         {/* Card */}
//                         <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
//                             <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

//                             <form
//                                 onSubmit={handleSubmit}
//                                 noValidate
//                                 className="space-y-4 sm:space-y-5"
//                             >
//                                 <Field
//                                     id="userId"
//                                     label="User ID"
//                                     icon={User}
//                                     value={form.userId}
//                                     onChange={handleChange}
//                                     placeholder="Enter your user ID"
//                                     autoComplete="username"
//                                     autoCapitalize="none"
//                                     autoCorrect="off"
//                                     spellCheck={false}
//                                     error={errors.userId}
//                                 />

//                                 <Field
//                                     id="password"
//                                     label="Password"
//                                     icon={Lock}
//                                     type={showPassword ? "text" : "password"}
//                                     value={form.password}
//                                     onChange={handleChange}
//                                     onKeyUp={handleCaps}
//                                     onKeyDown={handleCaps}
//                                     onBlur={() => setCapsLock(false)}
//                                     placeholder="Enter your password"
//                                     autoComplete="current-password"
//                                     error={errors.password}
//                                     hint={
//                                         capsLock ? "Caps Lock is on" : undefined
//                                     }
//                                     right={
//                                         <button
//                                             type="button"
//                                             aria-label={
//                                                 showPassword
//                                                     ? "Hide password"
//                                                     : "Show password"
//                                             }
//                                             aria-pressed={showPassword}
//                                             onClick={() =>
//                                                 setShowPassword((s) => !s)
//                                             }
//                                             className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
//                                         >
//                                             {showPassword ? (
//                                                 <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                                 <Eye className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                     }
//                                 />

//                                 <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
//                                     <label className="flex cursor-pointer items-center gap-2 text-slate-500">
//                                         <input
//                                             type="checkbox"
//                                             className="h-4 w-4 rounded border-slate-300 bg-white text-red-600 focus:ring-red-500"
//                                         />
//                                         Remember device
//                                     </label>
//                                     <a
//                                         href="#"
//                                         className="font-medium text-red-600 hover:text-red-500 hover:underline"
//                                     >
//                                         Reset access
//                                     </a>
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="h-4 w-4 animate-spin" />
//                                             Authenticating...
//                                         </>
//                                     ) : (
//                                         <>
//                                             Authenticate
//                                             <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
//                                         </>
//                                     )}
//                                 </button>
//                             </form>

//                             <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5 sm:mt-6 sm:pt-6">
//                                 <Shield className="h-4 w-4 shrink-0 text-red-500" />
//                                 <p className="text-xs text-slate-400">
//                                     Protected by AES-256 encryption
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <footer className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 pb-6 text-xs text-slate-400 sm:pb-8">
//                     <a href="#" className="hover:text-red-600">
//                         Privacy
//                     </a>
//                     <span aria-hidden="true">•</span>
//                     <a href="#" className="hover:text-red-600">
//                         Terms
//                     </a>
//                     <span aria-hidden="true">•</span>
//                     <a href="#" className="hover:text-red-600">
//                         Status
//                     </a>
//                 </footer>
//             </main>
//         </div>
//     );
// };

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    ScanLine,
    Shield,
    User,
    TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

const BASE_URL = import.meta.env.VITE_API_URL;

const ROLE_HOME = {
    executive: "/executive",
    super_admin: "/admin",
};

const Logo = () => (
    <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-white shadow-sm">
            <ScanLine className="h-6 w-6 text-red-600" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">
            OCR<span className="text-red-500">.</span>dev
        </span>
    </div>
);

const Field = ({ id, label, icon: Icon, error, right, hint, ...props }) => (
    <div>
        <label
            htmlFor={id}
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
        >
            {label}
        </label>

        <div
            className={clsx(
                "group flex items-center rounded-xl border bg-white transition focus-within:ring-4",
                error
                    ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-500/10"
                    : "border-slate-200 hover:border-slate-300 focus-within:border-red-500 focus-within:ring-red-500/10",
            )}
        >
            <span
                className={clsx(
                    "flex h-12 w-12 shrink-0 items-center justify-center",
                    error
                        ? "text-red-500"
                        : "text-slate-400 group-focus-within:text-red-500",
                )}
            >
                <Icon className="h-4 w-4" />
            </span>

            <input
                id={id}
                name={id}
                aria-invalid={!!error}
                className="h-12 w-full min-w-0 bg-transparent pr-3 text-base text-slate-900 outline-none placeholder:text-slate-400 sm:text-sm"
                {...props}
            />

            {right && (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                    {right}
                </span>
            )}
        </div>

        {error ? (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
                {error}
            </p>
        ) : hint ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <TriangleAlert className="h-3.5 w-3.5" />
                {hint}
            </p>
        ) : null}
    </div>
);

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ userId: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [capsLock, setCapsLock] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleCaps = (e) => {
        if (e.getModifierState) setCapsLock(e.getModifierState("CapsLock"));
    };

    const validate = () => {
        const next = {};
        if (!form.userId.trim()) next.userId = "User ID is required";
        if (!form.password) next.password = "Password is required";
        setErrors(next);
        return !Object.keys(next).length;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading || !validate()) return;

        try {
            setLoading(true);

            const { data } = await axios.post(
                `${BASE_URL}/api/v1/auth/login`,
                { userId: form.userId.trim(), password: form.password },
                { withCredentials: true },
            );

            if (!data?.success || !data?.access_token) {
                throw new Error(data?.message || "Login failed");
            }

            const role = String(data.user?.role || "").toLowerCase();
            const target = ROLE_HOME[role];
            if (!target)
                throw new Error(`No page configured for role "${role}"`);

            // simple storage: token + user
            localStorage.setItem("access_token", data?.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));

            toast.success("Logged in successfully");
            navigate(target, { replace: true });
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    err.message ||
                    "Something went wrong.",
                { duration: 2000 },
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-white text-slate-900">
            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[80vw] max-w-150 -translate-x-1/2 rounded-full bg-red-500/10 blur-[100px]" />

            <header className="relative flex justify-center px-4 pt-10">
                <Logo />
            </header>

            <main className="relative flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-sm sm:max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Sign in to your account
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Enter your credentials to continue.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-5"
                        >
                            <Field
                                id="userId"
                                label="User ID"
                                icon={User}
                                value={form.userId}
                                onChange={handleChange}
                                placeholder="Enter your user ID"
                                autoComplete="username"
                                autoCapitalize="none"
                                autoCorrect="off"
                                spellCheck={false}
                                error={errors.userId}
                            />

                            <Field
                                id="password"
                                label="Password"
                                icon={Lock}
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                onKeyUp={handleCaps}
                                onKeyDown={handleCaps}
                                onBlur={() => setCapsLock(false)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                error={errors.password}
                                hint={capsLock ? "Caps Lock is on" : undefined}
                                right={
                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:text-red-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-6">
                            <Shield className="h-4 w-4 shrink-0 text-red-500" />
                            <p className="text-xs text-slate-400">
                                Protected by AES-256 encryption
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
