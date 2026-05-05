import type React from "react";
import { MdArchive, MdDelete, MdPushPin, MdRestore, MdUnarchive, MdDeleteForever } from "react-icons/md";
import type { INote } from "../types";
import { useModal } from "./Modal.hook";

export type NoteActionContext = "notes" | "archive" | "trash" | "labels";

interface IActionButtonProps {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    danger?: boolean;
}

const ActionButton: React.FC<IActionButtonProps> = ({ label, onClick, children, danger }) => (
    <button
        type="button"
        title={label}
        aria-label={label}
        onClick={onClick}
        className={`p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition ${danger ? "text-red-600" : "text-slate-600"}`}
    >
        {children}
    </button>
);

export const useNoteActions = (note: INote, context: NoteActionContext): React.ReactNode => {
    const { confirm } = useModal();

    const onPin = () => {
        // TODO: call API to toggle pin
        console.log("toggle pin", note.id);
    };

    const onArchive = () => {
        // TODO: call API to archive
        console.log("archive", note.id);
    };

    const onUnarchive = () => {
        // TODO: call API to unarchive
        console.log("unarchive", note.id);
    };

    const onSoftDelete = async () => {
        const ok = await confirm({ message: "Chuyển ghi chú vào thùng rác?", confirmText: "Xóa", confirmColor: "bg-red-500" });
        if (!ok) return;
        // TODO: call API soft delete
        console.log("soft delete", note.id);
    };

    const onRestore = () => {
        // TODO: call API restore
        console.log("restore", note.id);
    };

    const onHardDelete = async () => {
        const ok = await confirm({ message: "Xóa vĩnh viễn ghi chú này? Hành động không thể hoàn tác.", confirmText: "Xóa vĩnh viễn", confirmColor: "bg-red-500" });
        if (!ok) return;
        // TODO: call API hard delete
        console.log("hard delete", note.id);
    };

    if (context === "notes") {
        return (
            <div className="flex gap-1">
                <ActionButton label={note.is_pinned ? "Bỏ ghim" : "Ghim"} onClick={onPin}>
                    <MdPushPin size={16} />
                </ActionButton>
                <ActionButton label="Lưu trữ" onClick={onArchive}>
                    <MdArchive size={16} />
                </ActionButton>
                <ActionButton label="Xóa" onClick={onSoftDelete} danger>
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
                <ActionButton label="Xóa" onClick={onSoftDelete} danger>
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
