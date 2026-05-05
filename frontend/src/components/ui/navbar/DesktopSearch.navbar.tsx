import { MdSearch } from "react-icons/md";

const DesktopSearch: React.FC = () => (
    <div className="hidden md:block flex-1 max-w-xl">
        <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 group-focus-within:text-indigo-500">
                <MdSearch size={24} />
            </span>
            <input
                type="text"
                placeholder="Tìm kiếm trong ghi chú..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
            />
        </div>
    </div>
);

export default DesktopSearch;