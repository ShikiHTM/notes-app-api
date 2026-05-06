import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";

const ArchivePage: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">Lưu trữ</h1>
            <NoteGrid notes={[]} emptyMessage="Chưa có ghi chú lưu trữ" />
        </div>
    );
};

export default ArchivePage;
