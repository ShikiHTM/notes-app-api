import type React from "react";
import type { EmptyVariant, INote } from "../../types";
import NoteCard from "./NoteCard.ui";
import type { NoteActionContext } from "../../hooks/NoteAction.hook";
import { EmptyPath } from "./EmptyPath.ui";

interface INoteGridProps {
    notes: INote[];
    emptyMessage?: string;
    variant: EmptyVariant;
    onCardClick?: (note: INote) => void;
    actionsContext?: NoteActionContext;
}

const NoteGrid: React.FC<INoteGridProps> = ({ notes, emptyMessage = "Chưa có ghi chú nào", variant, onCardClick, actionsContext }) => {
    if (notes.length === 0) {
        return (
            <EmptyPath
                message={emptyMessage}
                variant={variant}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map(note => (
                <NoteCard
                    key={note.id}
                    note={note}
                    onClick={onCardClick}
                    actionsContext={actionsContext}
                />
            ))}
        </div>
    );
};

export default NoteGrid;
