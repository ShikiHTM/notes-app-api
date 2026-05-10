import { MdNoteAlt } from "react-icons/md";
import { LuPanelRight } from "react-icons/lu";

type Props = {
    isOpen: boolean;
    onToggle: () => void;
};

const SidebarHeader: React.FC<Props> = ({ isOpen, onToggle }) => (
    <div className="flex items-center mb-5 h-12 px-2 overflow-hidden">
        <div
            className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "w-full opacity-100" : "w-0 opacity-0"}`}
        >
            <div className="bg-indigo-500 text-white rounded-md p-2 shrink-0">
                <MdNoteAlt size={24} />
            </div>
            <span className="font-bold ml-3 bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-2xl whitespace-nowrap">
                ProNotes
            </span>
        </div>

        <div
            className={`flex transition-all duration-300 ease-in-out ${isOpen ? "ml-2" : "w-full justify-start"}`}
        >
            <button
                onClick={onToggle}
                className="p-2 cursor-pointer text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:text-gh-fg-muted dark:hover:text-gh-accent dark:hover:bg-gh-canvas-inset rounded-lg transition-colors shrink-0"
            >
                <LuPanelRight size={24} />
            </button>
        </div>
    </div>
);

export default SidebarHeader;
