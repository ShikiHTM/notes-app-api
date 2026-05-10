import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../../api/Axios";
import useToast from "../../hooks/Toast.hook";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const token = searchParams.get("token") ?? "";
    const email = searchParams.get("email") ?? "";

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            showToast("Mật khẩu xác nhận không khớp.", "error");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setDone(true);
            showToast("Đặt lại mật khẩu thành công!", "success");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            let message = "Đặt lại mật khẩu thất bại.";
            if (error instanceof AxiosError && error.response?.data?.message) {
                message = error.response.data.message;
            }
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gh-canvas">
                <div className="bg-white dark:bg-gh-canvas-subtle rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <p className="text-red-500 font-medium">Liên kết không hợp lệ.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gh-canvas"
            style={{
                backgroundImage:
                    "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)",
            }}
        >
            <div className="bg-white dark:bg-gh-canvas-subtle rounded-2xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold text-gh-fg mb-2">
                    Đặt lại mật khẩu
                </h2>
                <p className="text-sm text-gh-fg-muted mb-6">
                    Nhập mật khẩu mới cho tài khoản <strong>{email}</strong>.
                </p>

                {done ? (
                    <p className="text-green-600 font-medium text-center">
                        Đặt lại mật khẩu thành công! Đang chuyển hướng...
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gh-fg-muted">
                                Mật khẩu mới
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                placeholder="Mật khẩu mới"
                                className="px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm text-gh-fg-muted">
                                Xác nhận mật khẩu
                            </span>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                                placeholder="Xác nhận mật khẩu mới"
                                className="px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading || !password || !passwordConfirmation}
                            className="mt-2 px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition hover:opacity-90 cursor-pointer font-medium"
                        >
                            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
