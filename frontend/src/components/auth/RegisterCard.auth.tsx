import type React from "react";
import type { IRegisterCardProps, IRegisterRequest } from "../../types";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    MdAccountCircle,
    MdCheckCircle,
    MdEmail,
    MdError,
    MdLock,
    MdNoteAlt,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import { useCheckUsername } from "../../hooks/CheckUsername.hook";

const scorePassword = (pw: string): number => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
};

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = [
    "bg-slate-200 dark:bg-gh-border",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
];

const RegisterCard: React.FC<IRegisterCardProps> = ({
    onRegister,
    isLoading,
}) => {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState<IRegisterRequest>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<{
        display_name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    const displayName = formData?.display_name ?? "";
    const usernameStatus = useCheckUsername(displayName);

    const password = formData?.password ?? "";
    const pwScore = useMemo(() => scorePassword(password), [password]);

    const validate = () => {
        const newErrors: typeof error = {};

        if (!formData?.display_name) {
            newErrors.display_name = "Username is required";
        } else if (formData.display_name.length < 3) {
            newErrors.display_name =
                "Username must be at least 3 characters";
        } else if (usernameStatus === "taken") {
            newErrors.display_name = "Username is already taken";
        }

        if (!formData?.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email";
        }

        if (!formData?.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (confirmPassword !== formData?.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            onRegister(formData!);
        }
    };

    const inputClasses =
        "w-full block pl-12 pr-4 py-4 " +
        "bg-white dark:bg-gh-canvas border border-slate-200 dark:border-gh-border rounded-xl " +
        "text-slate-900 dark:text-gh-fg placeholder:text-slate-400 dark:placeholder:text-gh-fg-subtle " +
        "focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 " +
        "aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10 aria-[invalid=true]:focus:border-red-500 " +
        "transition-all duration-200 shadow-sm";

    const submitDisabled = isLoading || usernameStatus === "checking" || usernameStatus === "taken";

    return (
        <div className="w-full max-w-105 bg-white dark:bg-gh-canvas-subtle rounded-lg shadow-lg p-8">
            {/* Logo */}
            <div
                className="text-white w-10 h-10 rounded-lg flex items-center justify-center m-auto"
                style={{ backgroundColor: "#6366f1" }}
            >
                <MdNoteAlt size={30} aria-hidden="true" />
            </div>

            <h2 className="font-bold text-gray-800 dark:text-gh-fg text-center mt-2 mb-2 text-4xl">
                Create account
            </h2>
            <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mb-8">
                Start your journey
            </p>

            <form onSubmit={handleSubmit} noValidate>
                {/* Display Name */}
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <label htmlFor="register-name" className="sr-only">
                        Username
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdAccountCircle
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            id="register-name"
                            ref={nameRef}
                            type="text"
                            autoComplete="username"
                            placeholder="Username"
                            aria-invalid={!!error.display_name || usernameStatus === "taken"}
                            aria-describedby="register-name-status"
                            className={inputClasses}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    display_name: e.target.value,
                                }));
                                if (error.display_name)
                                    setError((p) => ({ ...p, display_name: undefined }));
                            }}
                        />
                        {/* Availability indicator */}
                        {displayName.length >= 3 && (
                            <div
                                className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center"
                                aria-hidden="true"
                            >
                                {usernameStatus === "checking" && (
                                    <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                                )}
                                {usernameStatus === "available" && (
                                    <MdCheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {usernameStatus === "taken" && (
                                    <MdError className="w-5 h-5 text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        id="register-name-status"
                        role="status"
                        aria-live="polite"
                        className="min-h-[1rem] mt-1 ml-2"
                    >
                        {error.display_name ? (
                            <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                                {error.display_name}
                            </span>
                        ) : usernameStatus === "available" ? (
                            <span className="text-xs text-green-600 dark:text-green-400">
                                Username is available
                            </span>
                        ) : usernameStatus === "taken" ? (
                            <span className="text-xs text-red-500">
                                Username is already taken
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* Email */}
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <label htmlFor="register-email" className="sr-only">
                        Email
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdEmail
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            aria-invalid={!!error.email}
                            aria-describedby={
                                error.email ? "register-email-error" : undefined
                            }
                            className={inputClasses}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    email: e.target.value,
                                }));
                                if (error.email)
                                    setError((p) => ({ ...p, email: undefined }));
                            }}
                        />
                    </div>
                    {error.email && (
                        <span
                            id="register-email-error"
                            role="alert"
                            className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1"
                        >
                            {error.email}
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <label htmlFor="register-password" className="sr-only">
                        Password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdLock
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Password"
                            aria-invalid={!!error.password}
                            aria-describedby="register-password-strength"
                            className={inputClasses}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    password: e.target.value,
                                }));
                                if (error.password)
                                    setError((p) => ({ ...p, password: undefined }));
                            }}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                            className="absolute top-1/2 right-2 -translate-1/2 text-slate-400 shadow-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <MdVisibilityOff size={20} aria-hidden="true" />
                            ) : (
                                <MdVisibility size={20} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {/* Strength meter */}
                    {password.length > 0 && (
                        <div
                            id="register-password-strength"
                            className="mt-2 ml-1 flex items-center gap-2"
                            aria-live="polite"
                        >
                            <div className="flex gap-1 flex-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded transition-colors duration-200 ${
                                            i <= pwScore
                                                ? STRENGTH_COLOR[pwScore]
                                                : "bg-slate-200 dark:bg-gh-border"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-gh-fg-muted min-w-[60px] text-right">
                                {STRENGTH_LABEL[pwScore]}
                            </span>
                        </div>
                    )}
                    {error.password && (
                        <span
                            role="alert"
                            className="text-xs text-red-500 mt-1 ml-2 block animate-in fade-in slide-in-from-top-1"
                        >
                            {error.password}
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="w-full gap-5 px-4 sm:px-0">
                    <label htmlFor="register-confirm-password" className="sr-only">
                        Confirm password
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdLock
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            aria-invalid={!!error.confirmPassword}
                            aria-describedby={
                                error.confirmPassword
                                    ? "register-confirm-error"
                                    : undefined
                            }
                            className={inputClasses}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error.confirmPassword)
                                    setError((p) => ({ ...p, confirmPassword: undefined }));
                            }}
                        />
                        <button
                            type="button"
                            aria-label={
                                showConfirmPassword ? "Hide password" : "Show password"
                            }
                            aria-pressed={showConfirmPassword}
                            className="absolute top-1/2 right-2 -translate-1/2 text-slate-400 shadow-none"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? (
                                <MdVisibilityOff size={20} aria-hidden="true" />
                            ) : (
                                <MdVisibility size={20} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                    {error.confirmPassword && (
                        <span
                            id="register-confirm-error"
                            role="alert"
                            className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1"
                        >
                            {error.confirmPassword}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitDisabled}
                    className="
                    w-full mt-5 flex items-center justify-center text-white
                    bg-indigo-600 p-4 rounded-xl font-semibold cursor-pointer
                    shadow-lg

                    ring-indigo-500/0 ring-0

                    hover:bg-indigo-700 hover:ring-2 hover:ring-indigo-500/30

                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50

                    active:scale-[0.98]

                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:ring-0

                    transition-all duration-300 ease-out
                "
                >
                    {isLoading ? "Processing..." : "Sign up"}
                </button>
            </form>

            {/* Footer */}
            <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mt-6">
                Already have an account?{" "}
                <span
                    role="link"
                    tabIndex={0}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors focus:outline-none focus:underline"
                    onClick={() => navigate("/login")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate("/login");
                        }
                    }}
                >
                    Sign in now
                </span>
            </p>
        </div>
    );
};

export default RegisterCard;
