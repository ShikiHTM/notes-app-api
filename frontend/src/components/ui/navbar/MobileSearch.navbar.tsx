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
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-gh-fg-muted dark:hover:text-gh-accent dark:hover:bg-gh-canvas-inset rounded-full transition-colors"
                aria-label="Mở tìm kiếm"
            >
                <MdSearch size={24} />
            </button>
        ) : (
            <div className="fixed inset-x-0 top-0 z-80 bg-white dark:bg-gh-canvas-subtle px-4 py-3 shadow-xl flex items-center gap-3 border-b border-slate-300 dark:border-gh-border">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-gh-fg-subtle">
                        <MdSearch size={24} />
                    </span>
                    <input
                        type="text"
                        autoFocus
                        placeholder="Tìm kiếm trong ghi chú..."
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:bg-gh-canvas-inset dark:text-gh-fg dark:focus:ring-gh-accent dark:focus:bg-gh-canvas placeholder:dark:text-gh-fg-subtle outline-none text-[15px]"
                    />
                    <button
                        onClick={onClose}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 dark:text-gh-fg-subtle dark:hover:text-gh-accent transition-colors"
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
