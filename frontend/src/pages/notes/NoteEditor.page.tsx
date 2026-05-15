import type React from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { NoteProvider, useNoteContext } from "../../context/Note.context";
import { NOTE_COLOR_CSS } from "../../types";
import NoteHeader from "../../components/note/header.note";
import NoteArea from "../../components/note/area.note";
import NoteToolbar from "../../components/note/toolbar.note";
import NoteSkeleton from "../../components/note/skeleton.note";
import NoteLabels from "../../components/note/labels.note";
import NoteUnlockGate from "../../components/note/unlock.note";

const NoteEditorContent: React.FC = () => {
    const { isLoading, note, save } = useNoteContext();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                save();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [save]);

    if (isLoading) {
        return <NoteSkeleton />;
    }

    if (!note) {
        return (
            <div className="py-20 text-center text-slate-400 dark:text-gh-fg-subtle">
                Không tìm thấy ghi chú
            </div>
        );
    }

    const tint = note.color ? NOTE_COLOR_CSS[note.color] : undefined;
    const isLockedAndRedacted = note.is_locked && note.content_rich == null;

    return (
        <div
            className="flex h-full w-full flex-col gap-4"
            style={tint ? { backgroundColor: tint } : undefined}
        >
            <NoteToolbar />
            <NoteHeader />
            {isLockedAndRedacted ? (
                <NoteUnlockGate />
            ) : (
                <>
                    <NoteLabels />
                    <NoteArea />
                </>
            )}
        </div>
    );
};

const NoteEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const noteId = Number(id);

    if (!id || Number.isNaN(noteId)) {
        return <Navigate to="/notes" replace />;
    }

    return (
        <NoteProvider noteId={noteId}>
            <NoteEditorContent />
        </NoteProvider>
    );
};

export default NoteEditorPage;
