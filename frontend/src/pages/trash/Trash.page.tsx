import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";

const TrashPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">Thùng rác</h1>
            <NoteGrid notes={[]} emptyMessage="Thùng rác trống" variant={"trash"} />
        </div>
    );
};

export default TrashPage;
