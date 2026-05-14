import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
    MdAccountCircle,
    MdArrowBack,
    MdEmail,
    MdLockReset,
    MdMarkEmailRead,
} from "react-icons/md";
import api from "../../api/Axios";
import useToast from "../../hooks/Toast.hook";

type Phase = "email" | "username" | "sent";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [phase, setPhase] = useState<Phase>("email");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fieldError, setFieldError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [phase]);

    const inputClasses =
        "w-full block pl-12 pr-4 py-4 " +
        "bg-white dark:bg-gh-canvas border border-slate-200 dark:border-gh-border rounded-xl " +
        "text-slate-900 dark:text-gh-fg placeholder:text-slate-400 dark:placeholder:text-gh-fg-subtle " +
        "focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 " +
        "aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-500/10 aria-[invalid=true]:focus:border-red-500 " +
        "transition-all duration-200 shadow-sm";

    const submitButtonClasses =
        "w-full mt-5 flex items-center justify-center text-white " +
        "bg-indigo-600 p-4 rounded-xl font-semibold cursor-pointer shadow-lg " +
        "ring-indigo-500/0 ring-0 " +
        "hover:bg-indigo-700 hover:ring-2 hover:ring-indigo-500/30 " +
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 " +
        "active:scale-[0.98] " +
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:ring-0 " +
        "transition-all duration-300 ease-out";

    const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = email.trim();

        if (!trimmed) {
            setFieldError("Email không được để trống");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(trimmed)) {
            setFieldError("Email không hợp lệ");
            return;
        }

        setFieldError(null);
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", { email: trimmed });
            setPhase("sent");
        } catch (error) {
            const message =
                error instanceof AxiosError && error.response?.data?.message
                    ? error.response.data.message
                    : "Có lỗi xảy ra, vui lòng thử lại.";
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitUsername = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = username.trim();

        if (!trimmed) {
            setFieldError("Tên người dùng không được để trống");
            return;
        }
        if (trimmed.length < 3) {
            setFieldError("Tên người dùng phải có ít nhất 3 ký tự");
            return;
        }

        setFieldError(null);
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password-by-username", {
                username: trimmed,
            });
            setPhase("sent");
        } catch (error) {
            const message =
                error instanceof AxiosError && error.response?.data?.message
                    ? error.response.data.message
                    : "Có lỗi xảy ra, vui lòng thử lại.";
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gh-canvas px-4"
            style={{
                backgroundImage:
                    "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)",
            }}
        >
            <div className="w-full max-w-105 bg-white dark:bg-gh-canvas-subtle rounded-lg shadow-lg p-8">
                {/* Icon */}
                <div
                    className="text-white w-12 h-12 rounded-lg flex items-center justify-center m-auto"
                    style={{ backgroundColor: "#6366f1" }}
                >
                    {phase === "sent" ? (
                        <MdMarkEmailRead size={28} aria-hidden="true" />
                    ) : (
                        <MdLockReset size={28} aria-hidden="true" />
                    )}
                </div>

                {/* PHASE: email */}
                {phase === "email" && (
                    <>
                        <h2 className="font-bold text-gray-800 dark:text-gh-fg text-center mt-3 mb-2 text-3xl">
                            Quên mật khẩu?
                        </h2>
                        <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mb-8">
                            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                        </p>

                        <form onSubmit={handleSubmitEmail} noValidate>
                            <div className="w-full">
                                <label htmlFor="fp-email" className="sr-only">
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
                                        id="fp-email"
                                        ref={inputRef}
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email"
                                        value={email}
                                        aria-invalid={!!fieldError}
                                        aria-describedby={fieldError ? "fp-email-error" : undefined}
                                        className={inputClasses}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (fieldError) setFieldError(null);
                                        }}
                                    />
                                </div>
                                {fieldError && (
                                    <span
                                        id="fp-email-error"
                                        role="alert"
                                        className="text-xs text-red-500 mt-1 ml-2 block animate-in fade-in slide-in-from-top-1"
                                    >
                                        {fieldError}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={submitButtonClasses}
                            >
                                {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-400 dark:text-gh-fg-muted">
                            Không nhớ email?{" "}
                            <button
                                type="button"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors focus:outline-none focus:underline"
                                onClick={() => {
                                    setFieldError(null);
                                    setPhase("username");
                                }}
                            >
                                Thử với tên người dùng
                            </button>
                        </div>

                        <div className="mt-2 text-center text-sm">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1 text-gray-400 dark:text-gh-fg-muted hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <MdArrowBack size={16} aria-hidden="true" />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </>
                )}

                {/* PHASE: username */}
                {phase === "username" && (
                    <>
                        <h2 className="font-bold text-gray-800 dark:text-gh-fg text-center mt-3 mb-2 text-3xl">
                            Khôi phục bằng tên người dùng
                        </h2>
                        <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mb-8">
                            Nhập tên người dùng của bạn. Nếu tài khoản tồn tại,
                            chúng tôi sẽ gửi liên kết đặt lại đến email đã đăng ký.
                        </p>

                        <form onSubmit={handleSubmitUsername} noValidate>
                            <div className="w-full">
                                <label htmlFor="fp-username" className="sr-only">
                                    Tên người dùng
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <MdAccountCircle
                                            className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="fp-username"
                                        ref={inputRef}
                                        type="text"
                                        autoComplete="username"
                                        placeholder="Tên người dùng"
                                        value={username}
                                        aria-invalid={!!fieldError}
                                        aria-describedby={
                                            fieldError ? "fp-username-error" : undefined
                                        }
                                        className={inputClasses}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (fieldError) setFieldError(null);
                                        }}
                                    />
                                </div>
                                {fieldError && (
                                    <span
                                        id="fp-username-error"
                                        role="alert"
                                        className="text-xs text-red-500 mt-1 ml-2 block animate-in fade-in slide-in-from-top-1"
                                    >
                                        {fieldError}
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={submitButtonClasses}
                            >
                                {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 text-gray-400 dark:text-gh-fg-muted hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
                                onClick={() => {
                                    setFieldError(null);
                                    setPhase("email");
                                }}
                            >
                                <MdArrowBack size={16} aria-hidden="true" />
                                Quay lại nhập email
                            </button>
                        </div>
                    </>
                )}

                {/* PHASE: sent */}
                {phase === "sent" && (
                    <>
                        <h2 className="font-bold text-gray-800 dark:text-gh-fg text-center mt-3 mb-2 text-3xl">
                            Kiểm tra email của bạn
                        </h2>
                        <p className="text-gray-400 dark:text-gh-fg-muted text-center text-sm mb-6">
                            Nếu thông tin bạn cung cấp khớp với một tài khoản,
                            chúng tôi đã gửi một liên kết đặt lại mật khẩu đến
                            email đã đăng ký.
                        </p>
                        <p className="text-gray-400 dark:text-gh-fg-muted text-center text-xs mb-8">
                            Liên kết sẽ hết hạn sau 60 phút. Nếu bạn không thấy email,
                            hãy kiểm tra hộp thư rác.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className={submitButtonClasses}
                        >
                            Quay lại đăng nhập
                        </button>

                        <div className="mt-4 text-center text-sm text-gray-400 dark:text-gh-fg-muted">
                            Không nhận được email?{" "}
                            <button
                                type="button"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer transition-colors focus:outline-none focus:underline"
                                onClick={() => {
                                    setFieldError(null);
                                    setPhase("email");
                                }}
                            >
                                Thử lại
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
