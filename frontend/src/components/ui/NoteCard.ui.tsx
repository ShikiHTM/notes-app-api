import type React from "react";
import type { INote } from "../../types";
import { DEFAULT_LABEL_COLOR, NOTE_COLOR_CSS } from "../../types";
import {
    useNoteActions,
    type NoteActionContext,
} from "../../hooks/NoteAction.hook";

interface INoteCardProps {
    note: INote;
    onClick?: (note: INote) => void;
    actionsContext?: NoteActionContext;
}

const NoteCard: React.FC<INoteCardProps> = ({
    note,
    onClick,
    actionsContext,
}) => {
    const actions = useNoteActions(note, actionsContext ?? "notes");
    const tint = note.color ? NOTE_COLOR_CSS[note.color] : undefined;
    return (
        <div
            className="group relative bg-white border border-slate-200 dark:bg-gh-canvas-subtle dark:border-gh-border rounded-xl p-4 hover:shadow-md transition cursor-pointer flex flex-col gap-2"
            onClick={() => onClick?.(note)}
            style={tint ? { backgroundColor: tint } : undefined}
        >
            {note.images && note.images.length > 0 && (
                <div className="-mx-4 -mt-4 mb-1 overflow-hidden rounded-t-xl">
                    <img
                        src={note.images[0].image_url}
                        alt=""
                        className="w-full max-h-40 object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            {note.title && (
                <h3 className="font-semibold text-slate-800 dark:text-gh-fg line-clamp-1">
                    {note.title}
                </h3>
            )}

            <p className="text-sm text-slate-600 dark:text-gh-fg-muted line-clamp-4 whitespace-pre-wrap">
                {note.content}
            </p>

            {note.labels && note.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {note.labels.map((label) => (
                        <span
                            key={label.id}
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
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

            {actionsContext && actions && (
                <div
                    className="absolute top-2 right-2 transition"
                    onClick={(e) => e.stopPropagation()}
                >
                    {actions}
                </div>
            )}
        </div>
    );
};

export default NoteCard;
