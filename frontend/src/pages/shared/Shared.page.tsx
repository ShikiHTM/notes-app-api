import type React from "react";
import { useNavigate } from "react-router-dom";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { useSharedWithMe } from "../../hooks/NoteShare.hook";
import type { INote } from "../../types";

const SharedPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: notes = [], isLoading } = useSharedWithMe();

    const openNote = (note: INote) => navigate(`/notes/${note.id}`);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-gh-fg">
                Shared with me
            </h1>
            <NoteGrid
                notes={notes}
                onCardClick={openNote}
                emptyMessage="No notes have been shared with you yet"
                isLoading={isLoading}
            />
        </div>
    );
};

export default SharedPage;
