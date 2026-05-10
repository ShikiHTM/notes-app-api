import type React from "react";
import { useNoteContext } from "../../context/Note.context";

const NoteHeader: React.FC = () => {
    const { note, setTitle, save, isReadOnly } = useNoteContext();

    return (
        <input
            type="text"
            value={note?.title ?? ""}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => save()}
            readOnly={isReadOnly}
            placeholder="Tiêu đề"
            className="w-full bg-transparent text-2xl font-semibold text-slate-800 dark:text-gh-fg outline-none placeholder:text-slate-400 dark:placeholder:text-gh-fg-subtle"
        />
    );
};

export default NoteHeader;
