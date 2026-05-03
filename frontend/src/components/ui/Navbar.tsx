import type React from "react";
import { useState } from "react";
import { MdAccountCircle, MdSearch, MdSettings, MdViewList, MdViewModule } from "react-icons/md";
import SettingMenu from "./navbar/SettingMenu";

const Navbar: React.FC = () => {
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [isSettingMenuOpen, setIsSettingMenuOpen] = useState(false);

    return (
        <nav className="h-16 border-b border-slate-300 bg-white flex items-center justify-between px-8">
            {/* Left: Search bar */}
            <div className="flex-1 max-w-2xl">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 group-focus-within:text-indigo-500">
                        <MdSearch size="20"/>
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm trong ghi chú..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            {/* Right: User Settings & Tools */}
            <div className="relative flex items-center gap-6 text-slate-600">
                {/* Toggle View Mode */}
                <button
                    onClick={() => setViewMode(v => v === 'card' ? 'list' : 'card')}
                    className="hover:text-indigo-600 transition-colors cursor-pointer"
                    title= {viewMode === 'card' ? 'Chế độ thẻ' : 'Chế độ lưới'}
                >
                    {viewMode === 'card' ? <MdViewList size={24} /> : <MdViewModule size={24}/>}
                </button>

                {/* User Settings */}
                <button
                    onClick={() => setIsSettingMenuOpen(!isSettingMenuOpen)}
                    className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                    <MdSettings size={24}/>
                </button>

                {/* User Profile */}
                <button
                    className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                    <MdAccountCircle size={24}/>
                </button>

                {isSettingMenuOpen && (
                    <div className="absolute right-0 mt-4 top-full z-50 w-50">
                        <SettingMenu />
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
