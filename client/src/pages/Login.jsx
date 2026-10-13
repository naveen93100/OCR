
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
            OCR
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
