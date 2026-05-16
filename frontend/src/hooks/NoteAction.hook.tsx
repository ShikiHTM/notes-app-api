import type React from "react";
import {
    MdArchive,
    MdDelete,
    MdPushPin,
    MdRestore,
    MdUnarchive,
    MdDeleteForever,
} from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { INote } from "../types";
import { useModal } from "./Modal.hook";
import api from "../api/Axios";
import useToast from "./Toast.hook";
import {
    archivedNotesQueryKey,
    notesQueryKey,
    trashedNotesQueryKey,
} from "./Note.hook";

export type NoteActionContext = "notes" | "archive" | "trash" | "labels";

interface IActionButtonProps {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
}

const ActionButton: React.FC<IActionButtonProps> = ({
    label,
    onClick,
    children,
    danger,
    disabled,
}) => (
    <button
        type="button"
        title={label}
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-full bg-white/80 hover:bg-white dark:bg-gh-canvas-subtle/80 dark:hover:bg-gh-canvas-subtle shadow-sm transition disabled:opacity-50 ${danger ? "text-red-600 dark:text-gh-danger" : "text-slate-600 dark:text-gh-fg-muted"}`}
    >
        {children}
    </button>
);

export const useNoteActions = (
    note: INote,
    context: NoteActionContext,
): React.ReactNode => {
    const { confirm } = useModal();
    const { showToast } = useToast();
    const qc = useQueryClient();

    const pinMutation = useMutation({
        mutationFn: () =>
            api.patch(`/notes/${note.id}`, { is_pinned: !note.is_pinned }),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: notesQueryKey });
            const previous = qc.getQueryData<INote[]>(notesQueryKey);
            qc.setQueryData<INote[]>(notesQueryKey, (old) =>
                old?.map((n) =>
                    n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n,
                ),
            );
            return { previous };
        },
        onSuccess: () =>
            showToast(note.is_pinned ? "Unpinned" : "Pinned", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(notesQueryKey, ctx.previous);
            showToast("Failed to pin", "error");
        },
        onSettled: () => qc.invalidateQueries({ queryKey: notesQueryKey }),
    });

    const softDeleteMutation = useMutation({
        mutationFn: () => api.delete(`/notes/${note.id}`),
        onMutate: async () => {
            const sourceKey =
                context === "archive" ? archivedNotesQueryKey : notesQueryKey;
            await qc.cancelQueries({ queryKey: sourceKey });
            const previous = qc.getQueryData<INote[]>(sourceKey);
            qc.setQueryData<INote[]>(sourceKey, (old) =>
                old?.filter((n) => n.id !== note.id),
            );
            return { previous, sourceKey };
        },
        onSuccess: () => showToast("Moved to trash", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(ctx.sourceKey, ctx.previous);
            showToast("Failed to delete", "error");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: notesQueryKey });
            qc.invalidateQueries({ queryKey: archivedNotesQueryKey });
            qc.invalidateQueries({ queryKey: trashedNotesQueryKey });
        },
    });

    const archiveMutation = useMutation({
        mutationFn: () =>
            api.patch(`/notes/${note.id}`, {
                archived_at: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
            }),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: notesQueryKey });
            const previous = qc.getQueryData<INote[]>(notesQueryKey);
            qc.setQueryData<INote[]>(notesQueryKey, (old) =>
                old?.filter((n) => n.id !== note.id),
            );
            return { previous };
        },
        onSuccess: () => showToast("Archived", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(notesQueryKey, ctx.previous);
            showToast("Failed to archive", "error");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: notesQueryKey });
            qc.invalidateQueries({ queryKey: archivedNotesQueryKey });
        },
    });

    const unarchiveMutation = useMutation({
        mutationFn: () => api.patch(`/notes/${note.id}`, { archived_at: null }),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: archivedNotesQueryKey });
            const previous = qc.getQueryData<INote[]>(archivedNotesQueryKey);
            qc.setQueryData<INote[]>(archivedNotesQueryKey, (old) =>
                old?.filter((n) => n.id !== note.id),
            );
            return { previous };
        },
        onSuccess: () => showToast("Unarchived", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous)
                qc.setQueryData(archivedNotesQueryKey, ctx.previous);
            showToast("Failed to unarchive", "error");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: notesQueryKey });
            qc.invalidateQueries({ queryKey: archivedNotesQueryKey });
        },
    });

    const restoreMutation = useMutation({
        mutationFn: () => api.post(`/notes/${note.id}/restore`),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: trashedNotesQueryKey });
            const previous = qc.getQueryData<INote[]>(trashedNotesQueryKey);
            qc.setQueryData<INote[]>(trashedNotesQueryKey, (old) =>
                old?.filter((n) => n.id !== note.id),
            );
            return { previous };
        },
        onSuccess: () => showToast("Restored", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous)
                qc.setQueryData(trashedNotesQueryKey, ctx.previous);
            showToast("Failed to restore", "error");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: notesQueryKey });
            qc.invalidateQueries({ queryKey: trashedNotesQueryKey });
        },
    });

    const hardDeleteMutation = useMutation({
        mutationFn: () => api.delete(`/notes/${note.id}/force`),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: trashedNotesQueryKey });
            const previous = qc.getQueryData<INote[]>(trashedNotesQueryKey);
            qc.setQueryData<INote[]>(trashedNotesQueryKey, (old) =>
                old?.filter((n) => n.id !== note.id),
            );
            return { previous };
        },
        onSuccess: () => showToast("Permanently deleted", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous)
                qc.setQueryData(trashedNotesQueryKey, ctx.previous);
            showToast("Failed to delete permanently", "error");
        },
        onSettled: () =>
            qc.invalidateQueries({ queryKey: trashedNotesQueryKey }),
    });

    const onPin = () => pinMutation.mutate();

    const onArchive = async () => {
        const ok = await confirm({
            message: "Move this note to archive?",
            confirmText: "Archive",
        });
        if (!ok) return;
        archiveMutation.mutate();
    };

    const onUnarchive = () => unarchiveMutation.mutate();

    const onSoftDelete = async () => {
        const ok = await confirm({
            message: "Move this note to trash?",
            confirmText: "Delete",
            confirmColor: "bg-red-500",
        });
        if (!ok) return;
        softDeleteMutation.mutate();
    };

    const onRestore = () => restoreMutation.mutate();

    const onHardDelete = async () => {
        const ok = await confirm({
            message: "Hard delete this note? This action cannot be undo",
            confirmText: "Hard delete",
            confirmColor: "bg-red-500",
        });
        if (!ok) return;
        hardDeleteMutation.mutate();
    };

    if (context === "notes") {
        return (
            <div className="flex gap-1">
                <ActionButton
                    label={note.is_pinned ? "Unpinned" : "Pinned"}
                    onClick={onPin}
                    disabled={pinMutation.isPending}
                >
                    <MdPushPin size={16} />
                </ActionButton>
                <ActionButton
                    label="Archive"
                    onClick={onArchive}
                    disabled={archiveMutation.isPending}
                >
                    <MdArchive size={16} />
                </ActionButton>
                <ActionButton
                    label="Delete"
                    onClick={onSoftDelete}
                    danger
                    disabled={softDeleteMutation.isPending}
                >
                    <MdDelete size={16} />
                </ActionButton>
            </div>
        );
    }

    if (context === "archive") {
        return (
            <div className="flex gap-1">
                <ActionButton
                    label="Unarchive"
                    onClick={onUnarchive}
                    disabled={unarchiveMutation.isPending}
                >
                    <MdUnarchive size={16} />
                </ActionButton>
                <ActionButton
                    label="Delete"
                    onClick={onSoftDelete}
                    danger
                    disabled={softDeleteMutation.isPending}
                >
                    <MdDelete size={16} />
                </ActionButton>
            </div>
        );
    }

    if (context === "trash") {
        return (
            <div className="flex gap-1">
                <ActionButton
                    label="Restore"
                    onClick={onRestore}
                    disabled={restoreMutation.isPending}
                >
                    <MdRestore size={16} />
                </ActionButton>
                <ActionButton
                    label="Hard Delete"
                    onClick={onHardDelete}
                    danger
                    disabled={hardDeleteMutation.isPending}
                >
                    <MdDeleteForever size={16} />
                </ActionButton>
            </div>
        );
    }

    return null;
};
