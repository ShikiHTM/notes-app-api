import type { ISidebarItem, SidebarTab } from "../../../types";

type Props = {
    items: ISidebarItem[];
    activeTab: SidebarTab;
    onTabChange: (tab: SidebarTab) => void;
    isOpen: boolean;
};

const SidebarNav: React.FC<Props> = ({ items, activeTab, onTabChange, isOpen }) => (
    <nav className="flex flex-col gap-2">
        {items.map((item) => (
            <button
                key={item.id}
                className={`flex items-center gap-4 w-full p-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === item.id
                        ? "bg-indigo-100 text-indigo-700 font-bold dark:bg-gh-accent-subtle dark:text-gh-accent"
                        : "text-slate-600 hover:bg-indigo-50 dark:text-gh-fg-muted dark:hover:bg-gh-canvas-inset dark:hover:text-gh-fg"
                }`}
                onClick={() => onTabChange(item.id)}
            >
                <div className="w-8 h-10 flex justify-center items-center shrink-0">
                    {item.icon}
                </div>
                <div className={`overflow-hidden transition-all duration-300 flex items-center ${isOpen ? "ml-3 opacity-100 w-auto" : "ml-0 opacity-0 w-0"}`}>
                    <span className="whitespace-nowrap">{item.label}</span>
                </div>
            </button>
        ))}
    </nav>
);

export default SidebarNav;