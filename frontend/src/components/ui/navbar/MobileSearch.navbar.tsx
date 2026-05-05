import { MdSearch, MdClose } from "react-icons/md";

type Props = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const MobileSearch: React.FC<Props> = ({ isOpen, onOpen, onClose }) => (
    <div className="md:hidden flex items-center">
        {!isOpen ? (
            <button
                onClick={onOpen}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Mở tìm kiếm"
            >
                <MdSearch size={24} />
            </button>
        ) : (
            <div className="fixed inset-x-0 top-0 z-80 bg-white px-4 py-3 shadow-xl flex items-center gap-3 border-b border-slate-300">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <MdSearch size={24} />
                    </span>
                    <input
                        type="text"
                        autoFocus
                        placeholder="Tìm kiếm trong ghi chú..."
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-[15px]"
                    />
                    <button
                        onClick={onClose}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                        aria-label="Đóng tìm kiếm"
                    >
                        <MdClose size={22} />
                    </button>
                </div>
            </div>
        )}
    </div>
);

export default MobileSearch;