import type React from "react";
import type { EmptyVariant, INote } from "../../types";
import NoteCard from "./NoteCard.ui";
import NoteCardSkeleton from "./NoteCardSkeleton.ui";
import type { NoteActionContext } from "../../hooks/NoteAction.hook";

interface INoteGridProps {
    notes: INote[];
    emptyMessage?: string;
    onCardClick?: (note: INote) => void;
    actionsContext?: NoteActionContext;
    isLoading?: boolean;
    skeletonCount?: number;
}

const NoteGrid: React.FC<INoteGridProps> = ({ notes, emptyMessage = "Chưa có ghi chú nào", onCardClick, actionsContext, isLoading, skeletonCount = 8 }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <NoteCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-400 dark:text-gh-fg-subtle">
                {emptyMessage}
            </div>
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
