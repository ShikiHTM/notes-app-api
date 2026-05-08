import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { useNotes } from "../../hooks/Note.hook";
import type { INote } from "../../types";

const ArchivePage: React.FC = () => {
    const { data: notes = [], isLoading } = useNotes();

    const isArchived = notes.filter(n => !n.is_archived);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800">Lưu trữ</h1>
            <NoteGrid notes={isArchived} emptyMessage="Chưa có ghi chú lưu trữ" actionsContext="archive" isLoading={isLoading} />
        </div>
    );
};

export default ArchivePage;
