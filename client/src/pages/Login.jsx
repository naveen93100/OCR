// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   FileText,
//   Languages,
//   Loader2,
//   Lock,
//   ScanLine,
//   ShieldCheck,
//   User,
//   Zap,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import clsx from "clsx";
// import { useAuth } from "../context/AuthContext";

// const features = [
//   { icon: Zap, title: "Lightning fast", text: "Extract text from images and PDFs in seconds." },
//   { icon: Languages, title: "Multi-language", text: "Accurate recognition across many languages." },
//   { icon: ShieldCheck, title: "Secure by design", text: "Your documents stay private and protected." },
// ];

// /* ---------- Brand logo ---------- */
// const Logo = ({ light = false }) => (
//   <div className="flex items-center gap-3">
//     <div
//       className={clsx(
//         "flex h-11 w-11 items-center justify-center rounded-xl shadow-lg",
//         light
//           ? "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur"
//           : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-600/30"
//       )}
//     >
//       <ScanLine className="h-6 w-6" />
//     </div>
//     <div className="leading-tight">
//       <p className={clsx("text-lg font-bold tracking-tight", light ? "text-white" : "text-gray-900")}>
//         OCR Scanner
//       </p>
//       <p className={clsx("text-xs", light ? "text-blue-100" : "text-gray-500")}>
//         Smart document recognition
//       </p>
//     </div>
//   </div>
// );

// /* ---------- Animated document-scan illustration ---------- */
// const ScanIllustration = () => (
//   <div className="relative mx-auto w-full max-w-xs">
//     <div className="absolute -inset-6 rounded-full bg-white/10 blur-3xl" />
//     <div className="relative rounded-2xl bg-white p-5 shadow-2xl shadow-indigo-900/40">
//       <div className="mb-4 flex items-center gap-2">
//         <FileText className="h-4 w-4 text-blue-600" />
//         <span className="text-xs font-semibold text-gray-700">invoice_2026.pdf</span>
//         <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
//           Scanning
//         </span>
//       </div>

//       <div className="relative space-y-2.5 overflow-hidden rounded-lg bg-gray-50 p-4">
//         {[100, 92, 78, 100, 64, 88, 55].map((w, i) => (
//           <div key={i} className="h-2 rounded-full bg-gray-200" style={{ width: `${w}%` }} />
//         ))}
//         <span className="absolute left-2 top-2 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-blue-600" />
//         <span className="absolute right-2 top-2 h-4 w-4 rounded-tr-md border-r-2 border-t-2 border-blue-600" />
//         <span className="absolute bottom-2 left-2 h-4 w-4 rounded-bl-md border-b-2 border-l-2 border-blue-600" />
//         <span className="absolute bottom-2 right-2 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-blue-600" />
//         <div className="ocr-scan absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent">
//           <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 shadow-[0_0_12px_2px_rgba(59,130,246,0.8)]" />
//         </div>
//       </div>

//       <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
//         <span>Detected text</span>
//         <span className="font-semibold text-gray-800">98.7% accuracy</span>
//       </div>
//     </div>
//   </div>
// );

// /* ---------- Reusable input field ---------- */
// const Field = ({ id, label, icon: Icon, error, right, className, ...props }) => (
//   <div className="space-y-2">
//     <label htmlFor={id} className="block text-sm font-semibold text-gray-800">
//       {label}
//     </label>
//     <div className="group relative">
//       <span
//         className={clsx(
//           "pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition",
//           error
//             ? "bg-red-100 text-red-500"
//             : "bg-white text-gray-400 shadow-sm ring-1 ring-gray-200 group-focus-within:bg-blue-600 group-focus-within:text-white group-focus-within:ring-blue-600"
//         )}
//       >
//         <Icon className="h-4 w-4" />
//       </span>
//       <input
//         id={id}
//         name={id}
//         aria-invalid={!!error}
//         className={clsx(
//           "h-13 w-full rounded-xl border-2 py-3.5 pl-14 pr-12 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none transition",
//           error
//             ? "border-red-300 bg-red-50/60 focus:border-red-500 focus:ring-4 focus:ring-red-100"
//             : "border-transparent bg-gray-100 hover:bg-gray-200/70 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100",
//           className
//         )}
//         {...props}
//       />
//       {right}
//     </div>
//     {error && (
//       <p className="flex items-center gap-1 text-xs font-medium text-red-600" role="alert">
//         <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
//         {error}
//       </p>
//     )}
//   </div>
// );

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const redirectTo = location.state?.from?.pathname || "/dashboard";

//   const [form, setForm] = useState({ userId: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validate = () => {
//     const next = {};
//     if (!form.userId.trim()) next.userId = "User ID is required";
//     if (!form.password) next.password = "Password is required";
//     setErrors(next);
//     return Object.keys(next).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       setLoading(true);
//       await login(form.userId.trim(), form.password);
//       toast.success("Logged in successfully");
//       navigate(redirectTo, { replace: true });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="grid min-h-screen lg:grid-cols-2">
//       <style>{`
//         .h-13 { height: 3.25rem; }
//         @keyframes ocr-scan { 0% { top: -2.5rem; } 100% { top: 100%; } }
//         .ocr-scan { animation: ocr-scan 2.8s ease-in-out infinite alternate; }
//         @keyframes ocr-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
//         .ocr-float { animation: ocr-float 5s ease-in-out infinite; }
//         @keyframes ocr-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
//         .ocr-rise { animation: ocr-rise .5s ease-out both; }
//         @media (prefers-reduced-motion: reduce) { .ocr-scan, .ocr-float, .ocr-rise { animation: none; } }
//       `}</style>

//       {/* ============ Brand panel (desktop) ============ */}
//       <aside className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
//         <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />
//         <div
//           className="pointer-events-none absolute inset-0 opacity-[0.07]"
//           style={{
//             backgroundImage:
//               "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
//             backgroundSize: "32px 32px",
//           }}
//         />

//         <div className="relative">
//           <Logo light />
//         </div>

//         <div className="relative space-y-10">
//           <div className="ocr-float">
//             <ScanIllustration />
//           </div>

//           <div className="space-y-3">
//             <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
//               Turn any document into
//               <span className="block text-blue-200">searchable, editable text.</span>
//             </h1>
//             <p className="max-w-md text-sm text-blue-100">
//               Upload, scan and extract — accurate OCR built for teams that move fast.
//             </p>
//           </div>

//           <ul className="space-y-4">
//             {features.map(({ icon: Icon, title, text }) => (
//               <li key={title} className="flex items-start gap-3">
//                 <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20 backdrop-blur">
//                   <Icon className="h-4 w-4" />
//                 </span>
//                 <div>
//                   <p className="text-sm font-semibold">{title}</p>
//                   <p className="text-xs text-blue-100">{text}</p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <p className="relative text-xs text-blue-200">
//           © {new Date().getFullYear()} OCR Scanner. All rights reserved.
//         </p>
//       </aside>

//       {/* ============ Login panel ============ */}
//       <main className="flex min-h-screen flex-col bg-white">
//         {/* Mobile / tablet header */}
//         <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 px-6 pb-16 pt-10 text-white sm:px-10 lg:hidden">
//           <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
//           <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-violet-300/20 blur-2xl" />
//           <div
//             className="pointer-events-none absolute inset-0 opacity-[0.07]"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
//               backgroundSize: "28px 28px",
//             }}
//           />
//           <div className="relative mx-auto max-w-sm space-y-4 sm:max-w-md">
//             <Logo light />
//             <p className="text-sm text-blue-100">
//               Scan, extract and manage your documents in one place.
//             </p>
//           </div>
//         </header>

//         {/* Form sheet */}
//         <div className="relative -mt-8 flex flex-1 items-start justify-center rounded-t-[2rem] bg-white px-6 pb-10 pt-9 shadow-[0_-12px_30px_-12px_rgba(30,64,175,0.25)] sm:px-10 lg:mt-0 lg:items-center lg:rounded-none lg:px-12 lg:pb-0 lg:pt-0 lg:shadow-none">
//           <div className="ocr-rise w-full max-w-sm sm:max-w-md">
//             <div className="mb-8 space-y-2">
//               <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
//                 <ScanLine className="h-3.5 w-3.5" />
//                 OCR Dashboard
//               </span>
//               <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
//               <p className="text-sm text-gray-500">
//                 Enter your credentials to access your account.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} noValidate className="space-y-5">
//               <Field
//                 id="userId"
//                 label="User ID"
//                 icon={User}
//                 value={form.userId}
//                 onChange={handleChange}
//                 placeholder="Enter your user ID"
//                 autoComplete="username"
//                 error={errors.userId}
//               />

//               <Field
//                 id="password"
//                 label="Password"
//                 icon={Lock}
//                 type={showPassword ? "text" : "password"}
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 autoComplete="current-password"
//                 error={errors.password}
//                 right={
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 }
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:shadow-blue-600/40 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   <>
//                     Login
//                     <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
//                   </>
//                 )}
//               </button>
//             </form>

//             <div className="mt-8 flex items-center gap-3 rounded-xl bg-gray-50 p-3.5 ring-1 ring-gray-100">
//               <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
//                 <ShieldCheck className="h-4 w-4" />
//               </span>
//               <p className="text-xs leading-relaxed text-gray-500">
//                 Your session is protected with secure authentication. Never share your password.
//               </p>
//             </div>

//             <p className="mt-6 text-center text-xs text-gray-400 lg:hidden">
//               © {new Date().getFullYear()} OCR Scanner
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    ScanLine,
    Shield,
    User,
    Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";

const Field = ({ id, label, icon: Icon, error, right, ...props }) => (
    <div className="space-y-2">
        <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
            {label}
        </label>
        <div className="relative">
            <span
                className={clsx(
                    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2",
                    error ? "text-red-400" : "text-slate-500",
                )}
            >
                <Icon className="h-4 w-4" />
            </span>
            <input
                id={id}
                name={id}
                className={clsx(
                    "w-full rounded-xl border bg-slate-900/60 py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-600 outline-none transition",
                    error
                        ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                        : "border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30",
                )}
                {...props}
            />
            {right}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
);

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/dashboard";

    const [form, setForm] = useState({ userId: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
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

        if (!validate()) return;

        try {
            setLoading(true);

            console.log("Login request:", {
                userId: form.userId,
                password: form.password,
            });

            const result = await login(form.userId.trim(), form.password);

            console.log("Login success:", result);

            toast.success("Logged in successfully");

            navigate(redirectTo, { replace: true });
        } catch (err) {
            console.error("LOGIN ERROR:", err);

            console.error("Status:", err.response?.status);
            console.error("Response:", err.response?.data);
            console.error("Message:", err.message);

            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            {/* Grid background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            {/* Neon glows */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-100 w-150 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-75 w-100 rounded-full bg-purple-600/20 blur-[100px]" />

            <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-10 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-cyan-500/40 blur-xl" />
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-slate-900">
                                <ScanLine className="h-8 w-8 text-cyan-400" />
                            </div>
                        </div>
                        <h1 className="mt-5 text-2xl font-bold tracking-tight">
                            OCR<span className="text-cyan-400">.</span>dev
                        </h1>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                            Secure Access Portal
                        </p>
                    </div>

                    {/* Card */}
                    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-8 backdrop-blur-xl">
                        {/* Top accent line */}
                        <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

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
                                error={errors.userId}
                            />
                            <Field
                                id="password"
                                label="Password"
                                icon={Lock}
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                error={errors.password}
                                right={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((s) => !s)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-400"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                }
                            />

                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 text-slate-400">
                                    <input
                                        type="checkbox"
                                        className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    Remember device
                                </label>
                                <a
                                    href="#"
                                    className="font-medium text-cyan-400 hover:text-cyan-300"
                                >
                                    Reset access
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-cyan-500 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 disabled:opacity-60"
                            >
                                {loading ? "Authenticating..." : "Authenticate"}
                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-3 border-t border-slate-800 pt-6">
                            <Shield className="h-4 w-4 text-emerald-400" />
                            <p className="text-xs text-slate-500">
                                Protected by AES-256 encryption
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-600">
                        <a href="#" className="hover:text-slate-400">
                            Privacy
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-400">
                            Terms
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-400">
                            Status
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
