import type React from "react";
import { useNoteContext } from "../../context/Note.context";

const NoteArea: React.FC = () => {
    const { note, setContent, save, isReadOnly } = useNoteContext();

    return (
        <textarea
            value={note?.content ?? ""}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => save()}
            readOnly={isReadOnly}
            placeholder="Nội dung ghi chú…"
            className="w-full flex-1 resize-none bg-transparent text-base text-slate-700 dark:text-gh-fg outline-none placeholder:text-slate-400 dark:placeholder:text-gh-fg-subtle"
        />
    );
};

export default NoteArea;
