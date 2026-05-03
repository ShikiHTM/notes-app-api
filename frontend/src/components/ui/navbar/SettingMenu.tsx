import type React from "react";

const SettingMenu: React.FC = () => {
    return (
        <div className="rounded-lg bg-white border-2 border-slate-300 w-full p-2 shadow-xl">
            {/* header */}
            <span className="flex justify-center text-xl font-bold mb-4">Cài đặt</span>

            {/* Dark Mode */}
            <div className="flex justify-between">
                <span className="font-bold">Dark Mode</span>

                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="relative w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 peer-checked:transition-color"></div>
                </label>
            </div>

            {/* Font size */}
        </div>
    )
}

export default SettingMenu;
