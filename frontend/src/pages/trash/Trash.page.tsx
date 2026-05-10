import type React from "react";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { useTrashedNotes } from "../../hooks/Note.hook";

const TrashPage: React.FC = () => {
    const { data: notes = [], isLoading } = useTrashedNotes();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-gh-fg">
                Thùng rác
            </h1>
            <NoteGrid
                notes={notes}
                emptyMessage="Thùng rác trống"
                actionsContext="trash"
                isLoading={isLoading}
            />
        </div>
    );
};

export default TrashPage;
