import { useState } from "react";
import { MdPersonAdd, MdClose, MdShare } from "react-icons/md";
import { useNoteContext } from "../../context/Note.context";
import {
    useNoteShares,
    useRevokeShare,
    useShareNote,
    useUpdateShare,
} from "../../hooks/NoteShare.hook";
import { useModal } from "../../hooks/Modal.hook";
import type { SharePermission } from "../../types";

const PERMISSION_LABELS: Record<SharePermission, string> = {
    READ: "View only",
    READ_AND_WRITE: "Can edit",
};

const NoteShareToggle: React.FC = () => {
    const { note } = useNoteContext();
    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [pendingEmails, setPendingEmails] = useState<string[]>([]);
    const [permission, setPermission] = useState<SharePermission>("READ");

    const { confirm } = useModal();
    const noteId = note?.id ?? 0;
    const isOwner = note?.viewer_permission === "OWNER";

    const { data: shares = [], isLoading: sharesLoading } = useNoteShares(
        noteId,
        open && isOwner,
    );
    const { mutate: shareNote, isPending: isSharing } = useShareNote();
    const { mutate: updateShare } = useUpdateShare();
    const { mutate: revokeShare } = useRevokeShare();

    if (!note || !isOwner) return null;

    const addEmail = () => {
        const trimmed = emailInput.trim().toLowerCase();
        if (!trimmed) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
        if (pendingEmails.includes(trimmed)) {
            setEmailInput("");
            return;
        }
        setPendingEmails([...pendingEmails, trimmed]);
        setEmailInput("");
    };

    const removeEmail = (email: string) => {
        setPendingEmails(pendingEmails.filter((e) => e !== email));
    };

    const handleEmailKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            e.preventDefault();
            addEmail();
        } else if (e.key === "Backspace" && !emailInput && pendingEmails.length) {
            setPendingEmails(pendingEmails.slice(0, -1));
        }
    };

    const submit = () => {
        // Include any text still in the input as a final chip
        const all = [...pendingEmails];
        const trimmed = emailInput.trim().toLowerCase();
        if (
            trimmed &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
            !all.includes(trimmed)
        ) {
            all.push(trimmed);
        }
        if (all.length === 0) return;
        shareNote(
            { noteId, emails: all, permission },
            {
                onSuccess: (data) => {
                    setPendingEmails(data.not_found);
                    setEmailInput("");
                },
            },
        );
    };

    const close = () => {
        setOpen(false);
        setEmailInput("");
        setPendingEmails([]);
    };

    const onRevoke = async (userId: number, displayName: string) => {
        const ok = await confirm({
            message: `Revoke access for ${displayName}?`,
            confirmText: "Revoke",
            confirmColor: "bg-red-500",
        });
        if (!ok) return;
        revokeShare({ noteId, userId });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title="Share note"
                aria-label="Share note"
                className="p-1 rounded text-slate-500 dark:text-gh-fg-muted hover:bg-slate-100 dark:hover:bg-gh-canvas-inset cursor-pointer relative"
            >
                <MdShare size={18} />
                {shares.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gh-accent-emphasis text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                        {shares.length}
                    </span>
                )}
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gh-canvas-subtle rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gh-fg flex items-center gap-2">
                                <MdPersonAdd size={18} />
                                Share note
                            </h3>
                            <button
                                type="button"
                                onClick={close}
                                className="text-slate-400 hover:text-slate-600 dark:text-gh-fg-subtle dark:hover:text-gh-fg cursor-pointer"
                                aria-label="Close"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-gh-fg-muted mb-3">
                            Enter the email of the person you want to share with.
                        </p>

                        <div className="rounded-md border border-gh-border bg-gh-canvas px-2 py-1.5 mb-2 flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-gh-accent">
                            {pendingEmails.map((email) => (
                                <span
                                    key={email}
                                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-gh-canvas-inset px-2 py-0.5 text-xs text-slate-700 dark:text-gh-fg"
                                >
                                    {email}
                                    <button
                                        type="button"
                                        onClick={() => removeEmail(email)}
                                        className="hover:text-red-500 cursor-pointer"
                                        aria-label={`Remove ${email}`}
                                    >
                                        <MdClose size={12} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleEmailKey}
                                onBlur={addEmail}
                                placeholder={
                                    pendingEmails.length === 0
                                        ? "name@example.com"
                                        : ""
                                }
                                className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-gh-fg px-1 py-0.5"
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gh-fg-muted">
                                Permission:
                            </span>
                            <select
                                value={permission}
                                onChange={(e) =>
                                    setPermission(
                                        e.target.value as SharePermission,
                                    )
                                }
                                className="px-2 py-1.5 bg-gh-canvas border border-gh-border rounded-md text-gh-fg text-sm focus:outline-none focus:ring-2 focus:ring-gh-accent cursor-pointer"
                            >
                                <option value="READ">View only</option>
                                <option value="READ_AND_WRITE">
                                    Can edit
                                </option>
                            </select>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={
                                    isSharing ||
                                    (pendingEmails.length === 0 &&
                                        !emailInput.trim())
                                }
                                className="ml-auto px-3 py-1.5 bg-gh-accent-emphasis text-white rounded-md disabled:opacity-50 transition cursor-pointer hover:opacity-90 text-sm"
                            >
                                {isSharing ? "Sharing…" : "Share"}
                            </button>
                        </div>

                        <div className="border-t border-gh-border pt-4">
                            <h4 className="text-xs font-semibold uppercase text-gh-fg-muted mb-2">
                                Shared with
                            </h4>
                            {sharesLoading ? (
                                <p className="text-sm text-gh-fg-subtle">
                                    Loading…
                                </p>
                            ) : shares.length === 0 ? (
                                <p className="text-sm text-gh-fg-subtle">
                                    Not shared with anyone
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                    {shares.map((share) => (
                                        <div
                                            key={share.user_id}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gh-canvas-inset overflow-hidden shrink-0 flex items-center justify-center">
                                                {share.pfp_url ? (
                                                    <img
                                                        src={share.pfp_url}
                                                        alt={share.display_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-semibold text-gh-fg-muted">
                                                        {share.display_name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gh-fg truncate">
                                                    {share.display_name}
                                                </div>
                                                <div className="text-xs text-gh-fg-muted truncate">
                                                    {share.email}
                                                </div>
                                            </div>
                                            <select
                                                value={share.permission}
                                                onChange={(e) =>
                                                    updateShare({
                                                        noteId,
                                                        userId: share.user_id,
                                                        permission: e.target
                                                            .value as SharePermission,
                                                    })
                                                }
                                                className="px-2 py-1 bg-gh-canvas border border-gh-border rounded text-gh-fg text-xs focus:outline-none focus:ring-2 focus:ring-gh-accent cursor-pointer"
                                            >
                                                <option value="READ">
                                                    {PERMISSION_LABELS.READ}
                                                </option>
                                                <option value="READ_AND_WRITE">
                                                    {
                                                        PERMISSION_LABELS.READ_AND_WRITE
                                                    }
                                                </option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onRevoke(
                                                        share.user_id,
                                                        share.display_name,
                                                    )
                                                }
                                                aria-label={`Revoke access for ${share.display_name}`}
                                                className="p-1 text-red-500 hover:text-red-700 dark:text-gh-danger cursor-pointer"
                                            >
                                                <MdClose size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NoteShareToggle;
