import type React from "react";
import type { ISidebarItem, SidebarTab } from "../../types";
import { FaArchive, FaStickyNote, FaTag, FaTrash } from "react-icons/fa";
import { MdNoteAlt } from "react-icons/md";
import { useState } from "react";

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('notes');
    const menuItems: ISidebarItem[] = [
        { id: "notes", label: "Ghi chú", icon: <FaStickyNote size={20}/>},
        { id: "labels", label: "Nhãn", icon: <FaTag size={20}/>},
        { id: "archive", label: "Lưu trữ", icon: <FaArchive size={20}/>},
        { id: "trash", label: "Thùng rác", icon: <FaTrash size={20}/>},
    ]

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-slate-300 py-10 px-3 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center mb-5 px-2 mx-auto">
                <div className="bg-indigo-500 text-white rounded-md p-2 me-3">
                    <MdNoteAlt size={24} />
                </div>
                <span className="font-bold mb-0 bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-2xl">ProNotes</span>
            </div>

            {/* Item */}
            {menuItems.map((item, index) => {
                return (
                    <button
                        key={index}
                        className={`flex items-center gap-4 w-full p-3 rounded-lg transition-colors cursor-pointer ${
                                activeTab === item.id
                                ? "bg-indigo-100 text-indigo-700 font-bold"
                                : "hover:bg-indigo-50 text-slate-600 hover:text-indigo-600"
                            }`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                )
            })}
        </aside>
    )
}

export default Sidebar;
