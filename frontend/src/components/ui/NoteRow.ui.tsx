import type React from "react";
import { MdLock } from "react-icons/md";
import type { INote } from "../../types";
import { DEFAULT_LABEL_COLOR, NOTE_COLOR_CSS } from "../../types";
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
            {!note.is_locked &&
                note.images &&
                note.images.length > 0 && (
                    <img
                        src={note.images[0].image_url}
                        alt=""
                        className="w-12 h-12 rounded-md object-cover shrink-0"
                        loading="lazy"
                    />
                )}
            {note.is_locked && (
                <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-gh-canvas-inset flex items-center justify-center shrink-0">
                    <MdLock
                        size={20}
                        className="text-slate-500 dark:text-gh-fg-muted"
                    />
                </div>
            )}
            <div className="flex-1 min-w-0">
                {note.title && (
                    <h3 className="font-semibold text-slate-800 dark:text-gh-fg truncate">
                        {note.title}
                    </h3>
                )}
                <p className="text-sm text-slate-600 dark:text-gh-fg-muted truncate">
                    {note.is_locked
                        ? "Ghi chú đã được khóa"
                        : note.content || "—"}
                </p>
                {note.labels && note.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {note.labels.map((label) => (
                            <span
                                key={label.id}
                                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                                style={{
                                    backgroundColor:
                                        label.color ?? DEFAULT_LABEL_COLOR,
                                }}
                            >
                                <span className="max-w-[100px] truncate">
                                    {label.name}
                                </span>
                            </span>
                        ))}
                    </div>
                )}
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
