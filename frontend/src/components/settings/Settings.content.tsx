import React, { useState } from "react";
import { MdEdit, MdDarkMode, MdLightMode } from "react-icons/md";
import { useAuth } from "../../hooks/Auth.hook";
import { useTheme } from "../../hooks/Theme.hook";

const SettingsContent: React.FC = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.display_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");

    const isDirty =
        name !== (user?.display_name ?? "") || email !== (user?.email ?? "");
    const isDark = theme === "dark";

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
        </div>
    );
};

export default SettingsContent;
