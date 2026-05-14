import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import type { ILoginCardProps, ILoginRequest } from "../../types";
import {
    MdEmail,
    MdLock,
    MdNoteAlt,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";

const LoginCard: React.FC<ILoginCardProps> = ({ onLogin, isLoading }) => {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState<ILoginRequest>();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<{ email?: string; password?: string }>(
        {},
    );

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData?.email) {
            newErrors.email = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }

        if (!formData?.password) {
            newErrors.password = "Mật khẩu không được để trống";
        } else if (formData.password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            onLogin(formData!);
        }
    };

    const inputClasses =
        "w-full block pl-12 pr-4 py-4 " +
        "bg-white dark:bg-gh-canvas border border-slate-200 dark:border-gh-border rounded-xl " +
        "text-slate-900 dark:text-gh-fg placeholder:text-slate-400 dark:placeholder:text-gh-fg-subtle " +
        "focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 " +
        "aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10 aria-[invalid=true]:focus:border-red-500 " +
        "transition-all duration-200 shadow-sm";

    return (
        <div className="w-full max-w-105 bg-white dark:bg-gh-canvas-subtle rounded-lg shadow-lg p-8">
            {/* Logo */}
            <div
                className="text-white w-10 h-10 rounded-lg flex items-center justify-center m-auto"
                style={{
                    backgroundColor: "#6366f1",
                }}
            >
                <MdNoteAlt size={30} aria-hidden="true" />
            </div>

            <h2 className="font-bold text-gray-800 dark:text-gh-fg text-center mt-2 mb-2 text-4xl">
                Chào mừng trở lại
            </h2>
            <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mb-8">
                Vui lòng đăng nhập để tiếp tục
            </p>

            <form onSubmit={handleSubmit} noValidate>
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <label htmlFor="login-email" className="sr-only">
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
                            id="login-email"
                            ref={emailRef}
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            aria-invalid={!!error.email}
                            aria-describedby={error.email ? "login-email-error" : undefined}
                            className={inputClasses}
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    email: e.target.value,
                                }));
                                if (error.email) setError((p) => ({ ...p, email: undefined }));
                            }}
                        />
                    </div>
                    {error.email && (
                        <span
                            id="login-email-error"
                            role="alert"
                            className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1"
                        >
                            {error.email}
                        </span>
                    )}
                </div>
                <div className="w-full gap-5 px-4 sm:px-0">
                    <label htmlFor="login-password" className="sr-only">
                        Mật khẩu
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdLock
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Mật khẩu"
                            aria-invalid={!!error.password}
                            aria-describedby={
                                error.password ? "login-password-error" : undefined
                            }
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
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
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
                    {error.password && (
                        <span
                            id="login-password-error"
                            role="alert"
                            className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1"
                        >
                            {error.password}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
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
                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
            </form>

            {/* Footer */}
            <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mt-6">
                Chưa có tài khoản?{" "}
                <span
                    role="link"
                    tabIndex={0}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors focus:outline-none focus:underline"
                    onClick={() => navigate("/register")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate("/register");
                        }
                    }}
                >
                    Đăng ký ngay
                </span>
            </p>
            <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mt-2">
                Quên mật khẩu?{" "}
                <span
                    role="link"
                    tabIndex={0}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors focus:outline-none focus:underline"
                    onClick={() => navigate("/forgot-password")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate("/forgot-password");
                        }
                    }}
                >
                    Lấy lại mật khẩu
                </span>
            </p>
        </div>
    );
};

export default LoginCard;
