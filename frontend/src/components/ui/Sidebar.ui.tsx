import type React from "react";
import type { ISidebarItem } from "../../types";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarHeader from "./sidebar/SidebarHeader.sidebar";
import SidebarNav from "./sidebar/SidebarNav.sidebar";
import AccountSection from "./sidebar/AccountSection.sidebar";
import MobileHamburger from "./sidebar/MobileHamburger.sidebar";
import MobileOverlay from "./sidebar/MobileOverlay.sidebar";
import { FaArchive, FaStickyNote, FaTags, FaTrash } from "react-icons/fa";

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems: ISidebarItem[] = [
        { id: "notes", label: "Ghi chú", icon: <FaStickyNote size={20} /> },
        { id: "labels", label: "Nhãn", icon: <FaTags size={20} /> },
        { id: "archive", label: "Lưu trữ", icon: <FaArchive size={20} /> },
        { id: "trash", label: "Thùng rác", icon: <FaTrash size={20} /> },
    ];

    const activeTab = (menuItems.find(i => location.pathname.startsWith(`/${i.id}`))?.id ?? 'notes');

    return (
        <>
            <MobileOverlay
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <MobileHamburger
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(true)}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-300 dark:bg-gh-canvas-subtle dark:border-gh-border py-10 px-3
                    flex flex-col gap-5 transition-all duration-300 ease-in-out overflow-x-hidden
                    ${isSidebarOpen
                        ? "translate-x-0 w-64"
                        : "-translate-x-full w-0 md:w-20 md:translate-x-0"
                    } md:relative`}
            >
                <SidebarHeader
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <SidebarNav
                    items={menuItems}
                    activeTab={activeTab}
                    onTabChange={(tab) => navigate(`/${tab}`)}
                    isOpen={isSidebarOpen}
                />

                <AccountSection
                    isOpen={isSidebarOpen}
                    isAccountMenuOpen={isAccountMenuOpen}
                    onAccountMenuToggle={() => setIsAccountMenuOpen(v => !v)}
                />
            </aside>
        </>
    );
};

export default Sidebar;