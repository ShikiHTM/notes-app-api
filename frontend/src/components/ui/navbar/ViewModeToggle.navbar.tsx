import { MdViewList, MdViewModule } from "react-icons/md";

type Props = {
    viewMode: "card" | "list";
    onToggle: () => void;
};

const ViewModeToggle: React.FC<Props> = ({ viewMode, onToggle }) => (
    <button
        onClick={onToggle}
        className="hover:text-indigo-600 transition-colors cursor-pointer"
        title={viewMode === "card" ? "Chế độ thẻ" : "Chế độ lưới"}
        aria-label="Chuyển chế độ xem"
    >
        {viewMode === "card" ? (
            <MdViewList size={24} />
        ) : (
            <MdViewModule size={24} />
        )}
    </button>
);

export default ViewModeToggle;
