import { useNavigate, useSearchParams } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import { useLabels } from "../../../hooks/Label.hook";
import { DEFAULT_LABEL_COLOR } from "../../../types";

type Props = {
    isOpen: boolean;
};

const SidebarLabels: React.FC<Props> = ({ isOpen }) => {
    const { data: labels = [] } = useLabels();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const activeLabelId = params.get("label");

    if (labels.length === 0) return null;

    return (
        <div className="flex flex-col gap-1 mt-2 border-t border-slate-200 dark:border-gh-border pt-3 overflow-y-auto">
            {isOpen && (
                <span className="px-3 text-xs font-semibold uppercase text-slate-400 dark:text-gh-fg-subtle mb-1">
                    Nhãn
                </span>
            )}
            {labels.map((label) => {
                const isActive = activeLabelId === String(label.id);
                return (
                    <button
                        key={label.id}
                        onClick={() => navigate(`/notes?label=${label.id}`)}
                        title={label.name}
                        className={`flex items-center gap-4 w-full p-3 rounded-lg transition-all cursor-pointer ${
                            isActive
                                ? "bg-indigo-100 text-indigo-700 font-bold dark:bg-gh-accent-subtle dark:text-gh-accent"
                                : "text-slate-600 hover:bg-indigo-50 dark:text-gh-fg-muted dark:hover:bg-gh-canvas-inset dark:hover:text-gh-fg"
                        }`}
                    >
                        <div className="w-8 h-10 flex justify-center items-center shrink-0">
                            <FaTag
                                size={16}
                                style={{
                                    color: label.color ?? DEFAULT_LABEL_COLOR,
                                }}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-300 flex items-center ${isOpen ? "ml-3 opacity-100 w-auto" : "ml-0 opacity-0 w-0"}`}
                        >
                            <span className="whitespace-nowrap truncate">
                                {label.name}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default SidebarLabels;
