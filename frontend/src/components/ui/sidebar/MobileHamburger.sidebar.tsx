import { LuPanelRight } from "react-icons/lu";

type Props = { isOpen: boolean; onToggle: () => void };

const MobileHamburger: React.FC<Props> = ({ isOpen, onToggle }) =>
    !isOpen ? (
        <button
            onClick={onToggle}
            className="fixed bottom-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-600 hover:text-indigo-600 md:hidden transition-all active:scale-95 cursor-pointer"
        >
            <LuPanelRight size={24} />
        </button>
    ) : null;

export default MobileHamburger;