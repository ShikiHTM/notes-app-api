import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { INote, NoteColor } from "../types";
import api from "../api/Axios";
import useToast from "../hooks/Toast.hook";
import { notesQueryKey } from "../hooks/Note.hook";
import { useAuth } from "../hooks/Auth.hook";
import { useNoteCollab, type CollabHandle } from "../hooks/NoteCollab.hook";

interface INoteContextValue {
    note: INote | null;
    isLoading: boolean;
    isReadOnly: boolean;
    isDirty: boolean;
    isSaving: boolean;
    collab: CollabHandle | null;
    setTitle: (value: string) => void;
    updateContent: (rich: string, plain: string) => void;
    setColor: (value: NoteColor | null) => void;
    toggleLabel: (labelId: number) => void;
    setImages: (images: INote["images"]) => void;
    replaceNote: (note: INote) => void;
    save: () => Promise<void>;
}

const NoteContext = createContext<INoteContextValue | null>(null);

interface INoteProviderProps {
    noteId: number;
    children: ReactNode;
}

export function NoteProvider({ noteId, children }: INoteProviderProps) {
    const [note, setNote] = useState<INote | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();
    const qc = useQueryClient();
    const { token } = useAuth();

    // Open a Yjs collaboration session for this note. Locked notes don't
    // participate (the server rejects them anyway).
    const collabNoteId = note && !note.is_locked ? noteId : null;
    const collab = useNoteCollab(collabNoteId, token);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setIsDirty(false);

        api.get<INote>(`/notes/${noteId}`)
            .then((res) => {
                if (!cancelled) setNote(res.data);
            })
            .catch(() => {
                if (!cancelled) showToast("Failed to load note", "error");
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [noteId]);

    const isReadOnly =
        !!note?.deleted_at ||
        (note?.viewer_permission != null &&
            note.viewer_permission !== "OWNER" &&
            note.viewer_permission !== "READ_AND_WRITE");

    const setTitle = (title: string) => {
        setNote((n) => (n ? { ...n, title } : n));
        setIsDirty(true);
    };

    const updateContent = (rich: string, plain: string) => {
        setNote((n) =>
            n ? { ...n, content: plain, content_rich: rich } : n,
        );
        setIsDirty(true);
    };

    const setImages = (images: INote["images"]) => {
        setNote((n) => (n ? { ...n, images } : n));
    };

    const replaceNote = (n: INote) => {
        setNote(n);
        setIsDirty(false);
    };

    const setColor = (color: NoteColor | null) => {
        setNote((n) => (n ? { ...n, color } : n));
        setIsDirty(true);
    };

    const toggleLabel = (labelId: number) => {
        setNote((n) => {
            if (!n) return n;
            const current = n.labels ?? [];
            const exists = current.some((l) => l.id === labelId);
            const nextLabels = exists
                ? current.filter((l) => l.id !== labelId)
                : [...current, { id: labelId, user_id: 0, name: "", color: null }];
            return { ...n, labels: nextLabels };
        });
        setIsDirty(true);
    };

    const save = async () => {
        if (!note || isReadOnly || !isDirty || isSaving) return;
        setIsSaving(true);
        try {
            const res = await api.put<INote>(`/notes/${note.id}`, {
                title: note.title,
                content: note.content,
                content_rich: note.content_rich ?? null,
                color: note.color ?? null,
                labels: (note.labels ?? []).map((l) => l.id),
            });
            setNote(res.data);
            setIsDirty(false);
            qc.invalidateQueries({ queryKey: notesQueryKey });
        } catch {
            showToast("Failed to save", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const saveRef = useRef(save);
    saveRef.current = save;

    useEffect(() => {
        if (!note || !isDirty || isReadOnly) return;
        const timer = setTimeout(() => saveRef.current(), 800);
        return () => clearTimeout(timer);
    }, [
        note?.title,
        note?.content,
        note?.content_rich,
        note?.color,
        note?.labels,
        isDirty,
        isReadOnly,
    ]);

    return (
        <NoteContext.Provider
            value={{
                note,
                isLoading,
                isReadOnly,
                isDirty,
                isSaving,
                collab,
                setTitle,
                updateContent,
                setColor,
                toggleLabel,
                setImages,
                replaceNote,
                save,
            }}
        >
            {children}
        </NoteContext.Provider>
    );
}

export const useNoteContext = () => {
    const ctx = useContext(NoteContext);
    if (!ctx)
        throw new Error("useNoteContext must be used inside <NoteProvider>");
    return ctx;
};
