import type React from "react";
import type { INote } from "../../types";
import { NOTE_COLOR_CSS } from "../../types";
import {
    useNoteActions,
    type NoteActionContext,
} from "../../hooks/NoteAction.hook";

interface INoteRowProps {
    note: INote;
    onClick?: (note: INote) => void;
    actionsContext?: NoteActionContext;
}

const NoteRow: React.FC<INoteRowProps> = ({
    note,
    onClick,
    actionsContext,
}) => {
    const actions = useNoteActions(note, actionsContext ?? "notes");
    const tint = note.color ? NOTE_COLOR_CSS[note.color] : undefined;

    return (
        <div
            className="group flex items-center gap-4 bg-white border border-slate-200 dark:bg-gh-canvas-subtle dark:border-gh-border rounded-lg px-4 py-3 hover:shadow-sm transition cursor-pointer"
            onClick={() => onClick?.(note)}
            style={tint ? { backgroundColor: tint } : undefined}
        >
            <div className="flex-1 min-w-0">
                {note.title && (
                    <h3 className="font-semibold text-slate-800 dark:text-gh-fg truncate">
                        {note.title}
                    </h3>
                )}
                <p className="text-sm text-slate-600 dark:text-gh-fg-muted truncate">
                    {note.content || "—"}
                </p>
            </div>

            {actionsContext && actions && (
                <div
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    {actions}
                </div>
            )}
        </div>
    );
};

export default NoteRow;
