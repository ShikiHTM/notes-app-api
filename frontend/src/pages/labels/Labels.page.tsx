import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { CreateButton } from "../../components/ui/CreateButton.ui";
import { FaTag } from "react-icons/fa";

const LabelsPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">Nhãn</h1>
            <NoteGrid notes={[]} emptyMessage="Chưa có nhãn nào" />
            <CreateButton
                onClick={() => alert("Tạo nhãn mới")}
                icon={<FaTag size={24} />}
            />
        </div>
    );
};

export default LabelsPage;
