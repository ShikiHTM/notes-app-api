import { useState } from "react";
import { MdLock, MdLockOpen, MdLockReset } from "react-icons/md";
import { useNoteContext } from "../../context/Note.context";
import {
    useRemoveNotePassword,
    useSetNotePassword,
} from "../../hooks/NotePassword.hook";

type Mode = "set" | "change" | "remove" | null;

const NoteLockToggle: React.FC = () => {
    const { note, replaceNote, isReadOnly } = useNoteContext();
    const [mode, setMode] = useState<Mode>(null);
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");

    const { mutate: setPwd, isPending: isSetting } = useSetNotePassword();
    const { mutate: removePwd, isPending: isRemoving } =
        useRemoveNotePassword();

    if (!note) return null;
    if (isReadOnly) return null;

    const isLocked = !!note.is_locked;

    const reset = () => {
        setMode(null);
        setCurrent("");
        setNext("");
        setConfirm("");
    };

    const handleSet = () => {
        if (!next || next.length < 4) return;
        if (next !== confirm) return;
        setPwd(
            {
                noteId: note.id,
                password: next,
                currentPassword: mode === "change" ? current : undefined,
            },
            {
                onSuccess: (updated) => {
                    replaceNote(updated);
                    reset();
                },
            },
        );
    };

    const handleRemove = () => {
        if (!current) return;
        removePwd(
            { noteId: note.id, currentPassword: current },
            {
                onSuccess: (updated) => {
                    replaceNote(updated);
                    reset();
                },
            },
        );
    };

    const openMenu = () => {
        setMode(isLocked ? "change" : "set");
    };

    const pending = isSetting || isRemoving;
    const canSubmitSet =
        next.length >= 4 && next === confirm && (mode !== "change" || current);
    const canSubmitRemove = current.length > 0;

    return (
        <>
            <button
                type="button"
                onClick={openMenu}
                title={isLocked ? "Đổi/Gỡ mật khẩu" : "Đặt mật khẩu"}
                aria-label="Quản lý mật khẩu ghi chú"
                className="p-1 rounded text-slate-500 dark:text-gh-fg-muted hover:bg-slate-100 dark:hover:bg-gh-canvas-inset cursor-pointer"
            >
                {isLocked ? <MdLock size={18} /> : <MdLockOpen size={18} />}
            </button>

            {mode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gh-canvas-subtle rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="font-semibold text-gh-fg mb-1 flex items-center gap-2">
                            {mode === "set" && (
                                <>
                                    <MdLock size={18} /> Đặt mật khẩu cho ghi chú
                                </>
                            )}
                            {mode === "change" && (
                                <>
                                    <MdLockReset size={18} /> Đổi mật khẩu
                                </>
                            )}
                            {mode === "remove" && (
                                <>
                                    <MdLockOpen size={18} /> Gỡ mật khẩu
                                </>
                            )}
                        </h3>
                        <p className="text-sm text-gh-fg-muted mb-4">
                            {mode === "set" &&
                                "Mật khẩu tối thiểu 4 ký tự. Nội dung và ảnh sẽ bị ẩn cho đến khi bạn nhập đúng mật khẩu."}
                            {mode === "change" &&
                                "Nhập mật khẩu hiện tại và mật khẩu mới."}
                            {mode === "remove" &&
                                "Nhập mật khẩu hiện tại để gỡ khóa ghi chú này."}
                        </p>

                        <div className="flex flex-col gap-3">
                            {(mode === "change" || mode === "remove") && (
                                <input
                                    type="password"
                                    value={current}
                                    onChange={(e) => setCurrent(e.target.value)}
                                    placeholder="Mật khẩu hiện tại"
                                    autoFocus
                                    className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                />
                            )}

                            {(mode === "set" || mode === "change") && (
                                <>
                                    <input
                                        type="password"
                                        value={next}
                                        onChange={(e) =>
                                            setNext(e.target.value)
                                        }
                                        placeholder={
                                            mode === "set"
                                                ? "Mật khẩu mới"
                                                : "Mật khẩu mới"
                                        }
                                        className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                    />
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={(e) =>
                                            setConfirm(e.target.value)
                                        }
                                        placeholder="Xác nhận mật khẩu mới"
                                        className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                    />
                                    {next && confirm && next !== confirm && (
                                        <span className="text-xs text-red-600 dark:text-gh-danger">
                                            Mật khẩu xác nhận không khớp
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 justify-between mt-5">
                            <div>
                                {mode === "change" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode("remove");
                                            setNext("");
                                            setConfirm("");
                                        }}
                                        className="px-3 py-2 text-sm text-red-600 dark:text-gh-danger hover:underline cursor-pointer"
                                    >
                                        Gỡ mật khẩu
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="px-4 py-2 border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer text-sm"
                                >
                                    Hủy
                                </button>
                                {mode === "remove" ? (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={!canSubmitRemove || pending}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 text-sm"
                                    >
                                        {isRemoving ? "Đang gỡ…" : "Gỡ"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSet}
                                        disabled={!canSubmitSet || pending}
                                        className="px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 text-sm"
                                    >
                                        {isSetting ? "Đang lưu…" : "Lưu"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NoteLockToggle;
