import { MdSearch } from "react-icons/md";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const DesktopSearch: React.FC<Props> = ({ value, onChange }) => (
    <div className="hidden md:block flex-1 max-w-xl">
        <div className="relative group">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 group-focus-within:text-indigo-500 dark:text-gh-fg-subtle dark:group-focus-within:text-gh-accent">
                <MdSearch size={24} />
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:bg-gh-canvas-inset dark:text-gh-fg dark:focus:ring-gh-accent dark:focus:bg-gh-canvas placeholder:dark:text-gh-fg-subtle transition-all outline-none"
            />
        </div>
    </div>
);

export default DesktopSearch;
