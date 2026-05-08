import type React from "react";
import { MdArchive, MdDelete, MdPushPin, MdRestore, MdUnarchive, MdDeleteForever } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { INote } from "../types";
import { useModal } from "./Modal.hook";
import api from "../api/Axios";
import useToast from "./Toast.hook";
import { archivedNotesQueryKey, notesQueryKey, trashedNotesQueryKey } from "./Note.hook";

export type NoteActionContext = "notes" | "archive" | "trash" | "labels";

interface IActionButtonProps {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
}

const ActionButton: React.FC<IActionButtonProps> = ({ label, onClick, children, danger, disabled }) => (
    <button
        type="button"
        title={label}
        aria-label={label}
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition disabled:opacity-50 ${danger ? "text-red-600" : "text-slate-600"}`}
    >
        {children}
    </button>
);

export const useNoteActions = (note: INote, context: NoteActionContext): React.ReactNode => {
    const { confirm } = useModal();
    const { showToast } = useToast();
    const qc = useQueryClient();

    const pinMutation = useMutation({
        mutationFn: () => api.patch(`/notes/${note.id}`, { is_pinned: !note.is_pinned }),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: notesQueryKey });
            const previous = qc.getQueryData<INote[]>(notesQueryKey);
            qc.setQueryData<INote[]>(notesQueryKey, old =>
                old?.map(n => n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n)
            );
            return { previous };
        },
        onSuccess: () => showToast(note.is_pinned ? "Đã bỏ ghim" : "Đã ghim", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(notesQueryKey, ctx.previous);
            showToast("Không thể ghim", "error");
        },
        onSettled: () => qc.invalidateQueries({ queryKey: notesQueryKey }),
    });

    const softDeleteMutation = useMutation({
        mutationFn: () => api.delete(`/notes/${note.id}`),
        onMutate: async () => {
            const sourceKey = context === "archive" ? archivedNotesQueryKey : notesQueryKey;
            await qc.cancelQueries({ queryKey: sourceKey });
            const previous = qc.getQueryData<INote[]>(sourceKey);
            qc.setQueryData<INote[]>(sourceKey, old => old?.filter(n => n.id !== note.id));
            return { previous, sourceKey };
        },
        onSuccess: () => showToast("Đã chuyển vào thùng rác", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(ctx.sourceKey, ctx.previous);
            showToast("Không thể xóa", "error");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: notesQueryKey });
            qc.invalidateQueries({ queryKey: archivedNotesQueryKey });
            qc.invalidateQueries({ queryKey: trashedNotesQueryKey });
        },
    });

    const archiveMutation = useMutation({
        mutationFn: () => api.patch(`/notes/${note.id}`, {
            archived_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: notesQueryKey });
            const previous = qc.getQueryData<INote[]>(notesQueryKey);
            qc.setQueryData<INote[]>(notesQueryKey, old => old?.filter(n => n.id !== note.id));
            return { previous };
        },
        onSuccess: () => showToast("Đã lưu trữ", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(notesQueryKey, ctx.previous);
            showToast("Không thể lưu trữ", "error");
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
            qc.setQueryData<INote[]>(archivedNotesQueryKey, old => old?.filter(n => n.id !== note.id));
            return { previous };
        },
        onSuccess: () => showToast("Đã bỏ lưu trữ", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(archivedNotesQueryKey, ctx.previous);
            showToast("Không thể bỏ lưu trữ", "error");
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
            qc.setQueryData<INote[]>(trashedNotesQueryKey, old => old?.filter(n => n.id !== note.id));
            return { previous };
        },
        onSuccess: () => showToast("Đã khôi phục", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(trashedNotesQueryKey, ctx.previous);
            showToast("Không thể khôi phục", "error");
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
            qc.setQueryData<INote[]>(trashedNotesQueryKey, old => old?.filter(n => n.id !== note.id));
            return { previous };
        },
        onSuccess: () => showToast("Đã xóa vĩnh viễn", "success"),
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(trashedNotesQueryKey, ctx.previous);
            showToast("Không thể xóa vĩnh viễn", "error");
        },
        onSettled: () => qc.invalidateQueries({ queryKey: trashedNotesQueryKey }),
    });

    const onPin = () => pinMutation.mutate();

    const onArchive = async () => {
        const ok = await confirm({ message: "Chuyển ghi chú vào lưu trữ?", confirmText: "Lưu trữ" });
        if (!ok) return;
        archiveMutation.mutate();
    };

    const onUnarchive = () => unarchiveMutation.mutate();

    const onSoftDelete = async () => {
        const ok = await confirm({ message: "Chuyển ghi chú vào thùng rác?", confirmText: "Xóa", confirmColor: "bg-red-500" });
        if (!ok) return;
        softDeleteMutation.mutate();
    };

    const onRestore = () => restoreMutation.mutate();

    const onHardDelete = async () => {
        const ok = await confirm({ message: "Xóa vĩnh viễn ghi chú này? Hành động không thể hoàn tác.", confirmText: "Xóa vĩnh viễn", confirmColor: "bg-red-500" });
        if (!ok) return;
        hardDeleteMutation.mutate();
    };

    if (context === "notes") {
        return (
            <div className="flex gap-1">
                <ActionButton label={note.is_pinned ? "Bỏ ghim" : "Ghim"} onClick={onPin} disabled={pinMutation.isPending}>
                    <MdPushPin size={16} />
                </ActionButton>
                <ActionButton label="Lưu trữ" onClick={onArchive} disabled={archiveMutation.isPending}>
                    <MdArchive size={16} />
                </ActionButton>
                <ActionButton label="Xóa" onClick={onSoftDelete} danger disabled={softDeleteMutation.isPending}>
                    <MdDelete size={16} />
                </ActionButton>
            </div>
        );
    }

    if (context === "archive") {
        return (
            <div className="flex gap-1">
                <ActionButton label="Bỏ lưu trữ" onClick={onUnarchive} disabled={unarchiveMutation.isPending}>
                    <MdUnarchive size={16} />
                </ActionButton>
                <ActionButton label="Xóa" onClick={onSoftDelete} danger disabled={softDeleteMutation.isPending}>
                    <MdDelete size={16} />
                </ActionButton>
            </div>
        );
    }

    if (context === "trash") {
        return (
            <div className="flex gap-1">
                <ActionButton label="Khôi phục" onClick={onRestore} disabled={restoreMutation.isPending}>
                    <MdRestore size={16} />
                </ActionButton>
                <ActionButton label="Xóa vĩnh viễn" onClick={onHardDelete} danger disabled={hardDeleteMutation.isPending}>
                    <MdDeleteForever size={16} />
                </ActionButton>
            </div>
        );
    }

    return null;
};
