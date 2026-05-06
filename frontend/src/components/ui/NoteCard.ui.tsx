import type React from "react";
import type { INote } from "../../types";
import { useNoteActions, type NoteActionContext } from "../../hooks/NoteAction.hook";

interface INoteCardProps {
    note: INote;
    onClick?: (note: INote) => void;
    actionsContext?: NoteActionContext;
}

const NoteCard: React.FC<INoteCardProps> = ({ note, onClick, actionsContext }) => {
    const actions = useNoteActions(note, actionsContext ?? "notes");
    return (
        <div
            className="group relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer flex flex-col gap-2"
            onClick={() => onClick?.(note)}
            style={note.color ? { backgroundColor: note.color } : undefined}
        >
            {note.title && (
                <h3 className="font-semibold text-slate-800 line-clamp-1">{note.title}</h3>
            )}

            <p className="text-sm text-slate-600 line-clamp-4 whitespace-pre-wrap">
                {note.content}
            </p>

            {actionsContext && actions && (
                <div
                    className="absolute top-2 right-2 transition"
                    onClick={e => e.stopPropagation()}
                >
                    {actions}
                </div>
            )}
        </div>
    );
};

export default NoteCard;
