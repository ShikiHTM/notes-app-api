import type React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdCheckCircle, MdSync } from "react-icons/md";
import { useNoteContext } from "../../context/Note.context";
import NoteColorPicker from "./colorPicker.note";
import NoteLockToggle from "./lockToggle.note";
import NoteShareToggle from "./share.note";

const NoteToolbar: React.FC = () => {
    const { note, isReadOnly, isDirty, isSaving } = useNoteContext();
    const navigate = useNavigate();

    const renderStatus = () => {
        if (isReadOnly) {
            return (
                <span className="text-xs text-slate-400 dark:text-gh-fg-subtle">
                    Read-only
                </span>
            );
        }
        if (isSaving) {
            return (
                <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-gh-fg-muted">
                    <MdSync size={14} className="animate-spin" />
                    Saving…
                </span>
            );
        }
        if (isDirty) {
            return (
                <span className="text-xs text-amber-600 dark:text-gh-attention">
                    Unsaved
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-gh-success">
                <MdCheckCircle size={14} />
                Saved
            </span>
        );
    };

    const displayTitle = note?.title?.trim() || "Untitled";
    const sharedOwner =
        note?.viewer_permission &&
        note.viewer_permission !== "OWNER" &&
        note.user
            ? note.user
            : null;

    return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-gh-border pb-2">
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:text-gh-fg-muted dark:hover:bg-gh-canvas-inset"
                    aria-label="Back"
                >
                    <MdArrowBack size={18} />
                </button>
                <span className="truncate text-sm text-slate-600 dark:text-gh-fg-muted">
                    {displayTitle}
                </span>
                {sharedOwner && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-gh-canvas-inset px-2 py-0.5 text-xs text-slate-600 dark:text-gh-fg-muted shrink-0">
                        {sharedOwner.pfp_url ? (
                            <img
                                src={sharedOwner.pfp_url}
                                alt=""
                                className="w-4 h-4 rounded-full object-cover"
                            />
                        ) : null}
                        Shared by {sharedOwner.display_name}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <NoteColorPicker />
                <NoteLockToggle />
                <NoteShareToggle />
                {renderStatus()}
            </div>
        </div>
    );
};

export default NoteToolbar;
