import { useState } from "react";
import { MdLock } from "react-icons/md";
import { useNoteContext } from "../../context/Note.context";
import { useUnlockNote } from "../../hooks/NotePassword.hook";
import useToast from "../../hooks/Toast.hook";
import { AxiosError } from "axios";

const NoteUnlockGate: React.FC = () => {
    const { note, replaceNote } = useNoteContext();
    const [password, setPassword] = useState("");
    const { mutate: unlock, isPending } = useUnlockNote();
    const { showToast } = useToast();

    if (!note) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;
        unlock(
            { noteId: note.id, password },
            {
                onSuccess: (unlocked) => {
                    replaceNote(unlocked);
                    setPassword("");
                },
                onError: (error) => {
                    let msg = "Incorrect password";
                    if (error instanceof AxiosError) {
                        const data = error.response?.data;
                        if (typeof data?.error === "string") msg = data.error;
                    }
                    showToast(msg, "error");
                    setPassword("");
                },
            },
        );
    };

    return (
        <div className="flex flex-1 items-center justify-center py-20">
            <form
                onSubmit={submit}
                className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 dark:border-gh-border bg-white dark:bg-gh-canvas-subtle p-8 max-w-sm w-full mx-4"
            >
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-gh-canvas-inset flex items-center justify-center">
                    <MdLock
                        size={28}
                        className="text-slate-500 dark:text-gh-fg-muted"
                    />
                </div>
                <div className="text-center">
                    <h2 className="font-semibold text-slate-800 dark:text-gh-fg">
                        Note is locked
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-gh-fg-muted mt-1">
                        Enter the password to view the content
                    </p>
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoFocus
                    className="w-full px-3 py-2 bg-gh-canvas border border-gh-border rounded-md text-gh-fg focus:outline-none focus:ring-2 focus:ring-gh-accent"
                />
                <button
                    type="submit"
                    disabled={!password || isPending}
                    className="w-full px-4 py-2 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90"
                >
                    {isPending ? "Unlocking…" : "Unlock"}
                </button>
            </form>
        </div>
    );
};

export default NoteUnlockGate;
