import type React from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdCheckCircle, MdSync } from "react-icons/md";
import { useNoteContext } from "../../context/Note.context";

const NoteToolbar: React.FC = () => {
    const { note, isReadOnly, isDirty, isSaving } = useNoteContext();
    const navigate = useNavigate();

    const renderStatus = () => {
        if (isReadOnly) {
            return <span className="text-xs text-slate-400">Chỉ đọc</span>;
        }
        if (isSaving) {
            return (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MdSync size={14} className="animate-spin" />
                    Đang lưu…
                </span>
            );
        }
        if (isDirty) {
            return <span className="text-xs text-amber-600">Chưa lưu</span>;
        }
        return (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
                <MdCheckCircle size={14} />
                Đã lưu
            </span>
        );
    };

    const displayTitle = note?.title?.trim() || "Untitled";

    return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2">
            <div className="flex min-w-0 items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded p-1 text-slate-500 hover:bg-slate-100"
                    aria-label="Quay lại"
                >
                    <MdArrowBack size={18} />
                </button>
                <span className="truncate text-sm text-slate-600">{displayTitle}</span>
            </div>

            {renderStatus()}
        </div>
    );
};

export default NoteToolbar;
