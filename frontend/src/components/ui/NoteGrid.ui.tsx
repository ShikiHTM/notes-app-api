import type React from "react";
import type { INote } from "../../types";
import NoteCard from "./NoteCard.ui";
import NoteCardSkeleton from "./NoteCardSkeleton.ui";
import NoteRow from "./NoteRow.ui";
import NoteRowSkeleton from "./NoteRowSkeleton.ui";
import type { NoteActionContext } from "../../hooks/NoteAction.hook";
import { useViewMode } from "../../hooks/ViewMode.hook";

interface INoteGridProps {
    notes: INote[];
    emptyMessage?: string;
    onCardClick?: (note: INote) => void;
    actionsContext?: NoteActionContext;
    isLoading?: boolean;
    skeletonCount?: number;
}

const NoteGrid: React.FC<INoteGridProps> = ({
    notes,
    emptyMessage = "No notes yet",
    onCardClick,
    actionsContext,
    isLoading,
    skeletonCount = 8,
}) => {
    const { viewMode } = useViewMode();
    const isList = viewMode === "list";

    if (isLoading) {
        if (isList) {
            return (
                <div className="flex flex-col gap-2">
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <NoteRowSkeleton key={i} />
                    ))}
                </div>
            );
        }
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

    if (isList) {
        return (
            <div className="flex flex-col gap-2">
                {notes.map((note) => (
                    <NoteRow
                        key={note.id}
                        note={note}
                        onClick={onCardClick}
                        actionsContext={actionsContext}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note) => (
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
