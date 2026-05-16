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
    const isOwner =
        note.viewer_permission == null || note.viewer_permission === "OWNER";
    if (!isOwner) return null;

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
                title={isLocked ? "Change/Remove password" : "Set password"}
                aria-label="Manage note password"
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
                                    <MdLock size={18} /> Set password for note
                                </>
                            )}
                            {mode === "change" && (
                                <>
                                    <MdLockReset size={18} /> Change password
                                </>
                            )}
                            {mode === "remove" && (
                                <>
                                    <MdLockOpen size={18} /> Remove password
                                </>
                            )}
                        </h3>
                        <p className="text-sm text-gh-fg-muted mb-4">
                            {mode === "set" &&
                                "Password must be at least 4 characters. Content and images will be hidden until you enter the correct password."}
                            {mode === "change" &&
                                "Enter the current password and the new password."}
                            {mode === "remove" &&
                                "Enter the current password to unlock this note."}
                        </p>

                        <div className="flex flex-col gap-3">
                            {(mode === "change" || mode === "remove") && (
                                <input
                                    type="password"
                                    value={current}
                                    onChange={(e) => setCurrent(e.target.value)}
                                    placeholder="Current password"
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
                                        placeholder="New password"
                                        className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                    />
                                    <input
                                        type="password"
                                        value={confirm}
                                        onChange={(e) =>
                                            setConfirm(e.target.value)
                                        }
                                        placeholder="Confirm new password"
                                        className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                    />
                                    {next && confirm && next !== confirm && (
                                        <span className="text-xs text-red-600 dark:text-gh-danger">
                                            Passwords do not match
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
                                        Remove password
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="px-4 py-2 border border-gh-border text-gh-fg rounded-md hover:bg-gh-canvas-subtle transition cursor-pointer text-sm"
                                >
                                    Cancel
                                </button>
                                {mode === "remove" ? (
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        disabled={!canSubmitRemove || pending}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 text-sm"
                                    >
                                        {isRemoving ? "Removing…" : "Remove"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSet}
                                        disabled={!canSubmitSet || pending}
                                        className="px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 text-sm"
                                    >
                                        {isSetting ? "Saving…" : "Save"}
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
