import { MdViewList, MdViewModule } from "react-icons/md";
import { useViewMode } from "../../../hooks/ViewMode.hook";

const ViewModeToggle: React.FC = () => {
    const { viewMode, toggleViewMode } = useViewMode();
    const isGrid = viewMode === "grid";

    return (
        <button
            onClick={toggleViewMode}
            className="hover:text-indigo-600 dark:hover:text-gh-accent transition-colors cursor-pointer"
            title={isGrid ? "Switch to list view" : "Switch to grid view"}
            aria-label="Toggle view mode"
        >
            {isGrid ? <MdViewList size={24} /> : <MdViewModule size={24} />}
        </button>
    );
};

export default ViewModeToggle;
