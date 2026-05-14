import { useEffect, useRef, useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { LuChevronsUpDown } from "react-icons/lu";
import UserDropMenu from "./UserDropMenu.sidebar";
import SettingsModal from "../../modal/Settings.modal";
import { useAuth } from "../../../hooks/Auth.hook";

type Props = {
    isOpen: boolean;
    isAccountMenuOpen: boolean;
    onAccountMenuToggle: () => void;
    onAccountMenuClose: () => void;
};

const AccountSection: React.FC<Props> = ({
    isOpen,
    isAccountMenuOpen,
    onAccountMenuToggle,
    onAccountMenuClose,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showSettings, setShowSettings] = useState(false);
    const { user } = useAuth();

    const handleOpenSettings = () => {
        setShowSettings(true);
        onAccountMenuClose();
    };

    useEffect(() => {
        if (!isAccountMenuOpen) return;

        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                onAccountMenuClose();
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isAccountMenuOpen, onAccountMenuClose]);

    return (
        <>
            <div
                ref={containerRef}
                className="relative mt-auto px-1 overflow-visible"
            >
                <button
                    className="flex justify-between items-center w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-gh-canvas-inset transition-colors group cursor-pointer"
                    onClick={onAccountMenuToggle}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="text-slate-600 dark:text-gh-fg-muted shrink-0">
                            <MdAccountCircle size={24} />
                        </div>
                        {isOpen && (
                            <span className="font-medium text-slate-700 dark:text-gh-fg whitespace-nowrap">
                                {user?.display_name}
                            </span>
                        )}
                    </div>

                    {isOpen && (
                        <LuChevronsUpDown className="text-slate-400 group-hover:text-slate-600 dark:text-gh-fg-subtle dark:group-hover:text-gh-fg shrink-0" />
                    )}
                </button>

                {isAccountMenuOpen && (
                    <div className="absolute left-0 bottom-full min-h-22 mb-3 w-full px-1 z-60">
                        <UserDropMenu onOpenSettings={handleOpenSettings} />
                    </div>
                )}
            </div>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </>
    );
};

export default AccountSection;
