import React, { useRef, useState } from "react";
import {
    MdEdit,
    MdDarkMode,
    MdLightMode,
    MdCameraAlt,
    MdMail,
} from "react-icons/md";
import { useAuth } from "../../hooks/Auth.hook";
import { useTheme } from "../../hooks/Theme.hook";
import { useRequestPasswordReset } from "../../hooks/RequestPasswordReset.hook";
import {
    useUpdateAvatar,
    useUpdateProfile,
} from "../../hooks/UpdateProfile.hook";

const SettingsContent: React.FC = () => {
    const { mutate: updateProfile, isPending: isUpdatingProfile } =
        useUpdateProfile();
    const { mutate: updateAvatar, isPending: isUpdatingAvatar } =
        useUpdateAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.display_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");

    const { mutate: requestReset, isPending: isResetPending } =
        useRequestPasswordReset();

    const originalName = user?.display_name ?? "";
    const originalEmail = user?.email ?? "";
    const isDirty =
        name.trim() !== originalName || email.trim() !== originalEmail;
    const isDark = theme === "dark";

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        updateAvatar(file);
    };

    const handleDiscard = () => {
        setName(originalName);
        setEmail(originalEmail);
    };

    const handleSave = () => {
        const payload: { name?: string; email?: string } = {};
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        if (trimmedName !== originalName) payload.name = trimmedName;
        if (trimmedEmail !== originalEmail) payload.email = trimmedEmail;
        updateProfile(payload);
    };

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

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword("");
    };

    return (
        <div className="flex flex-col gap-8">
            <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gh-fg-muted mb-4">
                    Profile
                </h3>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                    <div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUpdatingAvatar}
                            aria-label="Change profile picture"
                            className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gh-canvas-inset overflow-hidden flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-progress disabled:opacity-60"
                        >
                            {user?.pfp_url ? (
                                <img
                                    src={user.pfp_url}
                                    alt={user.display_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-semibold text-gh-fg-muted">
                                    {(user?.display_name ?? "?")
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </button>
                        <span className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-gh-accent-emphasis text-white flex items-center justify-center shadow-md border-2 border-white dark:border-gh-canvas-subtle z-10000">
                            <MdCameraAlt size={16} />
                        </span>
                        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition hidden sm:flex items-center justify-center pointer-events-none">
                            <MdEdit size={28} className="text-white" />
                        </span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />

                    <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-gh-fg-muted">
                                Display name
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                className="px-3 py-2.5 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-gh-fg-muted">
                                Email
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="px-3 py-2.5 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                            />
                        </label>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
                            {isDirty && (
                                <button
                                    type="button"
                                    onClick={handleDiscard}
                                    disabled={isUpdatingProfile}
                                    className="px-4 py-2.5 sm:py-2 border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer disabled:opacity-50 text-sm"
                                >
                                    Discard
                                </button>
                            )}
                            <button
                                type="button"
                                disabled={!isDirty || isUpdatingProfile}
                                onClick={handleSave}
                                className="px-4 py-2.5 sm:py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer hover:opacity-90 text-sm"
                            >
                                {isUpdatingProfile ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-gh-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gh-fg-muted mb-4">
                    Security
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gh-border bg-gh-canvas-subtle px-4 py-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <MdMail
                            size={22}
                            className="text-gh-fg shrink-0 mt-0.5"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gh-fg">
                                Password
                            </span>
                            <span className="text-xs text-gh-fg-muted">
                                We'll email you a secure link to set a new
                                password.
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2.5 sm:py-2 border border-gh-border bg-gh-canvas text-gh-fg rounded-md hover:bg-gh-canvas-inset transition cursor-pointer text-sm whitespace-nowrap shrink-0"
                    >
                        Send reset email
                    </button>
                </div>
            </section>

            <section className="border-t border-gh-border pt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gh-fg-muted mb-4">
                    Appearance
                </h3>
                <div className="flex items-center justify-between rounded-lg border border-gh-border bg-gh-canvas-subtle px-4 py-3 gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        {isDark ? (
                            <MdDarkMode
                                size={22}
                                className="text-gh-fg shrink-0 mt-0.5"
                            />
                        ) : (
                            <MdLightMode
                                size={22}
                                className="text-gh-fg shrink-0 mt-0.5"
                            />
                        )}
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gh-fg">
                                Dark mode
                            </span>
                            <span className="text-xs text-gh-fg-muted">
                                Switch between light and dark themes.
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isDark}
                        aria-label="Toggle dark mode"
                        onClick={toggleTheme}
                        className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 ${isDark ? "bg-gh-accent-emphasis" : "bg-gh-border"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </section>

            {showPasswordModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={closePasswordModal}
                >
                    <div
                        className="bg-white dark:bg-gh-canvas-subtle rounded-xl shadow-xl p-5 sm:p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-semibold text-gh-fg mb-1">
                            Confirm password
                        </h3>
                        <p className="text-sm text-gh-fg-muted mb-4">
                            Enter your current password to receive a password
                            reset email.
                        </p>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handlePasswordReset()
                            }
                            placeholder="Current password"
                            autoComplete="current-password"
                            autoFocus
                            className="w-full px-3 py-2.5 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent mb-4"
                        />
                        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                            <button
                                type="button"
                                onClick={closePasswordModal}
                                className="px-4 py-2.5 sm:py-2 border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={!currentPassword || isResetPending}
                                className="px-4 py-2.5 sm:py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer hover:opacity-90 text-sm"
                            >
                                {isResetPending ? "Sending..." : "Send link"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsContent;
