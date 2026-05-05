import { MdAccountCircle } from "react-icons/md";
import { LuChevronsUpDown } from "react-icons/lu";
import UserDropMenu from "./UserDropMenu.sidebar";

type Props = {
    isOpen: boolean;
    isAccountMenuOpen: boolean;
    onAccountMenuToggle: () => void;
};

const AccountSection: React.FC<Props> = ({ isOpen, isAccountMenuOpen, onAccountMenuToggle }) => (
    <div className="relative mt-auto px-1 overflow-visible">
        <button
            className="flex justify-between items-center w-full p-3 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer"
            onClick={onAccountMenuToggle}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="text-slate-600 shrink-0">
                    <MdAccountCircle size={24} />
                </div>
                {isOpen && (
                    <span className="font-medium text-slate-700 whitespace-nowrap">Người dùng</span>
                )}
            </div>

            {isOpen && (
                <LuChevronsUpDown className="text-slate-400 group-hover:text-slate-600 shrink-0" />
            )}
        </button>

        {isAccountMenuOpen && (
            <div className="absolute left-0 bottom-full min-h-22 mb-3 w-full px-1 z-60">
                <UserDropMenu />
            </div>
        )}
    </div>
);

export default AccountSection;