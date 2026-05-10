import { useEffect, useRef, useState } from "react";
import { MdPalette, MdFormatColorReset } from "react-icons/md";
import {
    NOTE_COLORS,
    NOTE_COLOR_CSS,
    NOTE_COLOR_LABEL,
    type NoteColor,
} from "../../types";
import { useNoteContext } from "../../context/Note.context";

const NoteColorPicker: React.FC = () => {
    const { note, isReadOnly, setColor } = useNoteContext();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    if (!note || isReadOnly) return null;

    const pick = (value: NoteColor | null) => {
        setColor(value);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Chọn màu ghi chú"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-gh-fg-muted dark:hover:bg-gh-canvas-inset cursor-pointer"
            >
                <MdPalette size={18} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 z-50 flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-gh-border bg-white dark:bg-gh-canvas-subtle shadow-lg p-2">
                    <button
                        type="button"
                        onClick={() => pick(null)}
                        title="Mặc định"
                        aria-label="Mặc định"
                        className={`flex h-7 w-7 items-center justify-center rounded-full border transition cursor-pointer ${
                            note.color == null
                                ? "border-gh-accent ring-2 ring-gh-accent/30"
                                : "border-slate-300 dark:border-gh-border hover:border-slate-400 dark:hover:border-gh-fg-subtle"
                        }`}
                    >
                        <MdFormatColorReset
                            size={14}
                            className="text-slate-500 dark:text-gh-fg-muted"
                        />
                    </button>

                    {NOTE_COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => pick(c)}
                            title={NOTE_COLOR_LABEL[c]}
                            aria-label={NOTE_COLOR_LABEL[c]}
                            style={{ backgroundColor: NOTE_COLOR_CSS[c] }}
                            className={`h-7 w-7 rounded-full border transition cursor-pointer ${
                                note.color === c
                                    ? "border-gh-accent ring-2 ring-gh-accent/30"
                                    : "border-slate-300 dark:border-gh-border hover:border-slate-400 dark:hover:border-gh-fg-subtle"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NoteColorPicker;
