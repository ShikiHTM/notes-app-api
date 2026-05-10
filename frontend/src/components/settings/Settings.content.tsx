import React, { useState } from "react";
import { MdEdit, MdDarkMode, MdLightMode } from "react-icons/md";
import { useAuth } from "../../hooks/Auth.hook";
import { useTheme } from "../../hooks/Theme.hook";
import { useRequestPasswordReset } from "../../hooks/RequestPasswordReset.hook";

const SettingsContent: React.FC = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.display_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");

    const { mutate: requestReset, isPending: isResetPending } = useRequestPasswordReset();

    const isDirty =
        name !== (user?.display_name ?? "") || email !== (user?.email ?? "");
    const isDark = theme === "dark";

    const handlePasswordReset = () => {
        if (!currentPassword) return;
        requestReset(currentPassword, {
            onSuccess: () => {
                setShowPasswordModal(false);
                setCurrentPassword("");
            },
            onError: () => {
                setCurrentPassword("");
            },
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-6 items-start">
                <button
                    type="button"
                    className="relative group w-28 h-28 rounded-full bg-gh-canvas-inset overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
                >
                    <span className="text-3xl font-semibold text-gh-fg-muted">
                        {(user?.display_name ?? "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <MdEdit size={28} className="text-white" />
                    </div>
                </button>

                <div className="flex-1 flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-gh-fg-muted">
                            Tên tài khoản
                        </span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-sm text-gh-fg-muted">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                        />
                    </label>

                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-gh-fg-muted">Mật khẩu</span>
                        <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2 bg-gh-canvas-subtle border border-gh-border rounded-md text-gh-fg-muted select-none tracking-widest">
                                ••••••••
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(true)}
                                className="px-4 py-2 border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer text-sm whitespace-nowrap"
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={!isDirty}
                        onClick={() => {}}
                        className="self-start px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90"
                    >
                        Lưu
                    </button>
                </div>
            </div>

            <div className="border-t border-gh-border pt-6">
                <h3 className="text-sm font-semibold text-gh-fg mb-3">
                    Giao diện
                </h3>
                <div className="flex items-center justify-between rounded-lg border border-gh-border bg-gh-canvas-subtle px-4 py-3">
                    <div className="flex items-center gap-3">
                        {isDark ? (
                            <MdDarkMode size={22} className="text-gh-fg" />
                        ) : (
                            <MdLightMode size={22} className="text-gh-fg" />
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gh-fg">
                                Chế độ tối
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDark}
                        onClick={toggleTheme}
                        className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${
                            isDark ? "bg-gh-accent-emphasis" : "bg-gh-border"
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                isDark ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gh-canvas-subtle rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="font-semibold text-gh-fg mb-1">
                            Xác nhận mật khẩu
                        </h3>
                        <p className="text-sm text-gh-fg-muted mb-4">
                            Nhập mật khẩu hiện tại để gửi email đặt lại mật khẩu.
                        </p>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlePasswordReset()}
                            placeholder="Mật khẩu hiện tại"
                            autoFocus
                            className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent mb-4"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setCurrentPassword("");
                                }}
                                className="px-4 py-2 border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer text-sm"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={!currentPassword || isResetPending}
                                className="px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 text-sm"
                            >
                                {isResetPending ? "Đang gửi..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsContent;
