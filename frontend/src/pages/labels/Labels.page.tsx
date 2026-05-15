import type React from "react";
import { useState } from "react";
import { FaTag, FaCheck, FaTrash, FaPen, FaTimes } from "react-icons/fa";
import {
    useCreateLabel,
    useDeleteLabel,
    useLabels,
    useUpdateLabel,
} from "../../hooks/Label.hook";
import { useModal } from "../../hooks/Modal.hook";
import { DEFAULT_LABEL_COLOR, LABEL_COLOR_PRESETS } from "../../types";
import type { ILabel } from "../../types";

const ColorSwatches: React.FC<{
    value: string;
    onChange: (color: string) => void;
}> = ({ value, onChange }) => (
    <div className="flex items-center gap-2 flex-wrap">
        {LABEL_COLOR_PRESETS.map((c) => (
            <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                aria-label={`Chọn màu ${c}`}
                className={`w-6 h-6 rounded-full transition ring-offset-2 dark:ring-offset-gh-canvas ${
                    value.toLowerCase() === c.toLowerCase()
                        ? "ring-2 ring-slate-500 dark:ring-gh-fg"
                        : "hover:scale-110"
                }`}
                style={{ backgroundColor: c }}
            />
        ))}
    </div>
);

const LabelRow: React.FC<{ label: ILabel }> = ({ label }) => {
    const { confirm } = useModal();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(label.name);
    const [color, setColor] = useState(label.color ?? DEFAULT_LABEL_COLOR);

    const { mutate: updateLabel, isPending: isSaving } = useUpdateLabel();
    const { mutate: deleteLabel, isPending: isDeleting } = useDeleteLabel();

    const startEdit = () => {
        setName(label.name);
        setColor(label.color ?? DEFAULT_LABEL_COLOR);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const saveEdit = () => {
        const trimmed = name.trim();
        if (!trimmed) return;
        updateLabel(
            { id: label.id, name: trimmed, color },
            { onSuccess: () => setIsEditing(false) },
        );
    };

    const handleDelete = async () => {
        const ok = await confirm({
            message: `Xóa nhãn "${label.name}"? Các ghi chú liên kết sẽ không bị xóa.`,
            confirmText: "Xóa",
            confirmColor: "bg-red-500",
        });
        if (!ok) return;
        deleteLabel(label.id);
    };

    if (isEditing) {
        return (
            <div className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-gh-border bg-white dark:bg-gh-canvas-subtle p-4">
                <div className="flex items-center gap-3">
                    <span
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        maxLength={50}
                        className="flex-1 px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                    />
                </div>
                <ColorSwatches value={color} onChange={setColor} />
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1.5 text-sm border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer flex items-center gap-1.5"
                    >
                        <FaTimes size={12} /> Hủy
                    </button>
                    <button
                        type="button"
                        onClick={saveEdit}
                        disabled={!name.trim() || isSaving}
                        className="px-3 py-1.5 text-sm bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 flex items-center gap-1.5"
                    >
                        <FaCheck size={12} /> {isSaving ? "Đang lưu…" : "Lưu"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-center gap-3 rounded-lg border border-slate-200 dark:border-gh-border bg-white dark:bg-gh-canvas-subtle px-4 py-3 hover:shadow-sm transition">
            <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: label.color ?? DEFAULT_LABEL_COLOR }}
            />
            <span className="flex-1 text-slate-800 dark:text-gh-fg truncate">
                {label.name}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                    type="button"
                    onClick={startEdit}
                    aria-label="Sửa nhãn"
                    className="p-1.5 rounded-full text-slate-600 dark:text-gh-fg-muted hover:bg-slate-100 dark:hover:bg-gh-canvas-inset cursor-pointer"
                >
                    <FaPen size={14} />
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label="Xóa nhãn"
                    className="p-1.5 rounded-full text-red-600 dark:text-gh-danger hover:bg-red-50 dark:hover:bg-gh-canvas-inset cursor-pointer disabled:opacity-50"
                >
                    <FaTrash size={14} />
                </button>
            </div>
        </div>
    );
};

const LabelsPage: React.FC = () => {
    const { data: labels = [], isLoading } = useLabels();
    const { mutate: createLabel, isPending: isCreating } = useCreateLabel();

    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState(DEFAULT_LABEL_COLOR);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newName.trim();
        if (!trimmed) return;
        createLabel(
            { name: trimmed, color: newColor },
            {
                onSuccess: () => {
                    setNewName("");
                    setNewColor(DEFAULT_LABEL_COLOR);
                },
            },
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-gh-fg">
                Nhãn
            </h1>

            <form
                onSubmit={handleCreate}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-gh-border bg-white dark:bg-gh-canvas-subtle p-4"
            >
                <h2 className="text-sm font-semibold text-gh-fg-muted">
                    Tạo nhãn mới
                </h2>
                <div className="flex items-center gap-3">
                    <span
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: newColor }}
                    />
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Tên nhãn"
                        maxLength={50}
                        className="flex-1 px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                    />
                    <button
                        type="submit"
                        disabled={!newName.trim() || isCreating}
                        className="px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 flex items-center gap-2"
                    >
                        <FaTag size={14} />
                        {isCreating ? "Đang tạo…" : "Tạo"}
                    </button>
                </div>
                <ColorSwatches value={newColor} onChange={setNewColor} />
            </form>

            {isLoading ? (
                <div className="text-slate-400 dark:text-gh-fg-subtle">
                    Đang tải…
                </div>
            ) : labels.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-slate-400 dark:text-gh-fg-subtle">
                    Chưa có nhãn nào
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {labels.map((label) => (
                        <LabelRow key={label.id} label={label} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LabelsPage;
