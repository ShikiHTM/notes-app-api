import React, { useState } from "react";
import { useAuth } from "../../../hooks/auth.hook";
import { MdLogout, MdSettings } from "react-icons/md";
import SettingsModal from "../../modal/Settings.modal";

const UserDropMenu: React.FC = () => {
    const { logout } = useAuth();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-300 rounded-md shadow-lg py-1 z-50">
                <button
                    className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => setShowSettings(prev => !prev)}
                >
                    <MdSettings size={16} />Cài đặt
                </button>

                <div className= "h-px bg-slate-200 my-1 mx-4" />

                <button
                    className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    onClick={logout}
                >
                    <MdLogout size={16} />Đăng xuất
                </button>
            </div>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </>
    )
}

export default UserDropMenu;