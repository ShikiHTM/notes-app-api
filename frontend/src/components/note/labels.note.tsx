import { useEffect, useRef, useState } from "react";
import { FaTag, FaTimes, FaCheck, FaPlus } from "react-icons/fa";
import { useNoteContext } from "../../context/Note.context";
import { useLabels } from "../../hooks/Label.hook";
import { DEFAULT_LABEL_COLOR } from "../../types";

const NoteLabels: React.FC = () => {
    const { note, isReadOnly, toggleLabel } = useNoteContext();
    const { data: allLabels = [] } = useLabels();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    const attached = note?.labels ?? [];
    const attachedIds = new Set(attached.map((l) => l.id));

    // Resolve display info from the canonical labels list so renames show instantly
    const resolvedAttached = attached.map(
        (l) => allLabels.find((x) => x.id === l.id) ?? l,
    );

    return (
        <div
            ref={containerRef}
            className="relative flex items-center gap-2 flex-wrap"
        >
            {resolvedAttached.map((label) => (
                <span
                    key={label.id}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                    style={{
                        backgroundColor: label.color ?? DEFAULT_LABEL_COLOR,
                    }}
                >
                    <FaTag size={10} />
                    <span className="max-w-[140px] truncate">{label.name}</span>
                    {!isReadOnly && (
                        <button
                            type="button"
                            onClick={() => toggleLabel(label.id)}
                            aria-label={`Bỏ nhãn ${label.name}`}
                            className="hover:opacity-80 cursor-pointer"
                        >
                            <FaTimes size={10} />
                        </button>
                    )}
                </span>
            ))}

            {!isReadOnly && (
                <button
                    type="button"
                    onClick={() => setIsOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 dark:border-gh-border px-2.5 py-1 text-xs text-slate-500 dark:text-gh-fg-muted hover:bg-slate-100 dark:hover:bg-gh-canvas-inset cursor-pointer"
                >
                    <FaPlus size={10} />
                    Nhãn
                </button>
            )}

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-30 w-64 max-h-72 overflow-y-auto bg-white dark:bg-gh-canvas-subtle border border-slate-200 dark:border-gh-border rounded-lg shadow-lg p-1">
                    {allLabels.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-slate-500 dark:text-gh-fg-muted">
                            Chưa có nhãn nào
                        </div>
                    ) : (
                        allLabels.map((label) => {
                            const checked = attachedIds.has(label.id);
                            return (
                                <button
                                    key={label.id}
                                    type="button"
                                    onClick={() => toggleLabel(label.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left hover:bg-slate-100 dark:hover:bg-gh-canvas-inset cursor-pointer"
                                >
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                label.color ??
                                                DEFAULT_LABEL_COLOR,
                                        }}
                                    />
                                    <span className="flex-1 text-sm text-slate-700 dark:text-gh-fg truncate">
                                        {label.name}
                                    </span>
                                    {checked && (
                                        <FaCheck
                                            size={12}
                                            className="text-emerald-600 dark:text-gh-success"
                                        />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default NoteLabels;
