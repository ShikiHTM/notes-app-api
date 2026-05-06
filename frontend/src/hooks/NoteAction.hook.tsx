import type React from "react";
import { MdArchive, MdDelete, MdPushPin, MdRestore, MdUnarchive, MdDeleteForever } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { INote } from "../types";
import { useModal } from "./Modal.hook";
import api from "../api/Axios";
import useToast from "./Toast.hook";
import { notesQueryKey } from "./Note.hook";

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
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(notesQueryKey, ctx.previous);
            showToast("Không thể ghim", "error");
        },
        onSettled: () => qc.invalidateQueries({ queryKey: notesQueryKey }),
    });

    const softDeleteMutation = useMutation({
        mutationFn: () => api.delete(`/notes/${note.id}`),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: notesQueryKey });
            const previous = qc.getQueryData<INote[]>(notesQueryKey);
            qc.setQueryData<INote[]>(notesQueryKey, old => old?.filter(n => n.id !== note.id));
            return { previous };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.previous) qc.setQueryData(notesQueryKey, ctx.previous);
            showToast("Không thể xóa", "error");
        },
        onSettled: () => qc.invalidateQueries({ queryKey: notesQueryKey }),
    });

    const onPin = () => pinMutation.mutate();

    const onArchive = () => {
        // TODO: backend chưa có cờ is_archived
        console.log("archive", note.id);
    };

    const onUnarchive = () => {
        // TODO: backend chưa có cờ is_archived
        console.log("unarchive", note.id);
    };

    const onSoftDelete = async () => {
        const ok = await confirm({ message: "Chuyển ghi chú vào thùng rác?", confirmText: "Xóa", confirmColor: "bg-red-500" });
        if (!ok) return;
        softDeleteMutation.mutate();
    };

    const onRestore = () => {
        // TODO: route /notes/:id/restore chưa đăng ký
        console.log("restore", note.id);
    };

    const onHardDelete = async () => {
        const ok = await confirm({ message: "Xóa vĩnh viễn ghi chú này? Hành động không thể hoàn tác.", confirmText: "Xóa vĩnh viễn", confirmColor: "bg-red-500" });
        if (!ok) return;
        // TODO: route force-delete chưa đăng ký
        console.log("hard delete", note.id);
    };

    if (context === "notes") {
        return (
            <div className="flex gap-1">
                <ActionButton label={note.is_pinned ? "Bỏ ghim" : "Ghim"} onClick={onPin} disabled={pinMutation.isPending}>
                    <MdPushPin size={16} />
                </ActionButton>
                <ActionButton label="Lưu trữ" onClick={onArchive}>
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
                <ActionButton label="Bỏ lưu trữ" onClick={onUnarchive}>
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
                <ActionButton label="Khôi phục" onClick={onRestore}>
                    <MdRestore size={16} />
                </ActionButton>
                <ActionButton label="Xóa vĩnh viễn" onClick={onHardDelete} danger>
                    <MdDeleteForever size={16} />
                </ActionButton>
            </div>
        );
    }

    return null;
};
