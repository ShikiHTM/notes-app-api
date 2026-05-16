import React from "react";
import { useAuth } from "../../../hooks/Auth.hook";
import { MdLogout, MdSettings } from "react-icons/md";
import { useModal } from "../../../hooks/Modal.hook";

interface Props {
    onOpenSettings: () => void;
}

const UserDropMenu: React.FC<Props> = ({ onOpenSettings }) => {
    const { logout } = useAuth();
    const { confirm } = useModal();

    return (
        <>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-300 dark:bg-gh-canvas-subtle dark:border-gh-border rounded-md shadow-lg py-1 z-50">
                <button
                    className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-gh-fg dark:hover:bg-gh-canvas-inset transition-colors cursor-pointer"
                    onClick={onOpenSettings}
                >
                    <MdSettings size={16} />
                    Settings
                </button>

                <div className="h-px bg-slate-200 dark:bg-gh-border my-1 mx-4" />

                <button
                    className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-gh-danger dark:hover:bg-gh-danger-subtle transition-colors cursor-pointer"
                    onClick={async () => {
                        const ok = await confirm({
                            message: "Are you sure you want to log out?",
                            confirmText: "Log out",
                            confirmColor: "bg-red-500",
                        });

                        if (ok) logout();
                    }}
                >
                    <MdLogout size={16} />
                    Log out
                </button>
            </div>
        </>
    );
};

export default UserDropMenu;
