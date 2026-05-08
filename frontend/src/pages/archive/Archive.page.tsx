import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { useArchivedNotes } from "../../hooks/Note.hook";

const ArchivePage: React.FC = () => {
    const { data: notes = [], isLoading } = useArchivedNotes();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">Lưu trữ</h1>
            <NoteGrid notes={notes} emptyMessage="Chưa có ghi chú lưu trữ" actionsContext="archive" isLoading={isLoading} />
        </div>
    );
};

export default ArchivePage;
