import { useCallback, useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdFormatQuote,
    MdImage,
    MdCode,
    MdTitle,
    MdUndo,
    MdRedo,
} from "react-icons/md";
import { useNoteContext } from "../../context/Note.context";
import {
    useDeleteNoteImage,
    useUploadNoteImage,
} from "../../hooks/NoteImage.hook";
import { useAuth } from "../../hooks/Auth.hook";

const CARET_COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
];

function pickCaretColor(seed: number | string): string {
    const key = String(seed);
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) | 0;
    }
    return CARET_COLORS[Math.abs(hash) % CARET_COLORS.length];
}

const collectImageSrcs = (editor: Editor): Set<string> => {
    const srcs = new Set<string>();
    editor.state.doc.descendants((node) => {
        if (node.type.name === "image" && typeof node.attrs.src === "string") {
            srcs.add(node.attrs.src);
        }
    });
    return srcs;
};

const ToolbarButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    label: string;
    children: React.ReactNode;
}> = ({ onClick, active, disabled, label, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={label}
        aria-label={label}
        className={`p-1.5 rounded text-slate-600 dark:text-gh-fg-muted hover:bg-slate-100 dark:hover:bg-gh-canvas-inset disabled:opacity-40 cursor-pointer ${
            active
                ? "bg-slate-100 text-slate-800 dark:bg-gh-canvas-inset dark:text-gh-fg"
                : ""
        }`}
    >
        {children}
    </button>
);

const NoteArea: React.FC = () => {
    const { note, isReadOnly, updateContent, setImages, save, collab } =
        useNoteContext();
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previousSrcsRef = useRef<Set<string>>(new Set());
    const imagesRef = useRef(note?.images ?? []);
    const seededRef = useRef(false);

    useEffect(() => {
        imagesRef.current = note?.images ?? [];
    }, [note?.images]);

    // Reset the seed flag when switching notes so the new doc gets seeded once.
    useEffect(() => {
        seededRef.current = false;
    }, [note?.id]);

    const noteId = note?.id ?? 0;
    const isOwner = note?.viewer_permission === "OWNER";
    const { mutate: uploadImage, isPending: isUploading } =
        useUploadNoteImage(noteId);
    const { mutate: deleteImageById } = useDeleteNoteImage(noteId);

    const initialContent = useMemo(() => {
        if (!note) return null;
        if (note.content_rich) {
            try {
                return JSON.parse(note.content_rich);
            } catch {
                /* fall through */
            }
        }
        const text = note.content ?? "";
        return text
            ? {
                  type: "doc",
                  content: text.split("\n").map((line) => ({
                      type: "paragraph",
                      content: line
                          ? [{ type: "text", text: line }]
                          : undefined,
                  })),
              }
            : null;
    }, [note?.id]);

    const caretColor = useMemo(
        () => (user ? pickCaretColor(user.id) : "#3b82f6"),
        [user?.id],
    );

    const editor = useEditor(
        {
            extensions: collab
                ? [
                      // History is provided by the Collaboration extension; disable
                      // StarterKit's history to avoid a conflict.
                      StarterKit.configure({ undoRedo: false }),
                      Image.configure({ inline: false, allowBase64: false }),
                      Placeholder.configure({ placeholder: "Note content…" }),
                      Collaboration.configure({ document: collab.ydoc }),
                      CollaborationCaret.configure({
                          provider: collab.provider,
                          user: {
                              name: user?.display_name ?? "Anonymous",
                              color: caretColor,
                          },
                      }),
                  ]
                : [
                      StarterKit,
                      Image.configure({ inline: false, allowBase64: false }),
                      Placeholder.configure({ placeholder: "Note content…" }),
                  ],
            // Without yjs, seed from REST content; with yjs, Y.Doc is the source
            // of truth and we seed via setContent on first sync (owner only).
            content: collab ? undefined : initialContent ?? "",
            editable: !isReadOnly,
            editorProps: {
                attributes: {
                    class: "tiptap-content focus:outline-none min-h-[200px] text-base text-slate-700 dark:text-gh-fg",
                },
            },
            onCreate: ({ editor: e }) => {
                previousSrcsRef.current = collectImageSrcs(e);
            },
            onUpdate: ({ editor: e }) => {
                const json = JSON.stringify(e.getJSON());
                const text = e.getText();
                updateContent(json, text);

                // Only the owner reconciles attached images; otherwise every
                // collaborator would race to DELETE the same image.
                if (!isOwner) return;

                const current = collectImageSrcs(e);
                const removed = [...previousSrcsRef.current].filter(
                    (src) => !current.has(src),
                );
                previousSrcsRef.current = current;

                if (removed.length > 0) {
                    const live = imagesRef.current;
                    const removedIds: number[] = [];
                    for (const src of removed) {
                        const match = live.find(
                            (img) => img.image_url === src,
                        );
                        if (match) {
                            removedIds.push(match.id);
                            deleteImageById(match.id);
                        }
                    }
                    if (removedIds.length > 0) {
                        const next = live.filter(
                            (img) => !removedIds.includes(img.id),
                        );
                        imagesRef.current = next;
                        setImages(next);
                    }
                }
            },
            onBlur: () => {
                save();
            },
        },
        // Depend on the stable provider/ydoc refs (not the collab object),
        // so status/isSynced changes don't tear down the editor mid-flight.
        [note?.id, collab?.ydoc, collab?.provider],
    );

    // Seed the Y.Doc once on first sync if it's empty and we have existing
    // REST content. Only the owner seeds to avoid duplicated insertions when
    // multiple collaborators happen to be the first to connect.
    useEffect(() => {
        if (!editor || !collab || !collab.isSynced) return;
        if (seededRef.current) return;
        if (!isOwner) {
            seededRef.current = true;
            return;
        }
        if (!editor.isEmpty) {
            seededRef.current = true;
            return;
        }
        if (initialContent) {
            editor.commands.setContent(initialContent, { emitUpdate: false });
            previousSrcsRef.current = collectImageSrcs(editor);
        }
        seededRef.current = true;
    }, [editor, collab?.isSynced, isOwner, initialContent]);

    useEffect(() => {
        editor?.setEditable(!isReadOnly);
    }, [editor, isReadOnly]);

    const handleImageUpload = useCallback(
        (file: File) => {
            if (!editor || !noteId) return;
            uploadImage(file, {
                onSuccess: (image) => {
                    editor
                        .chain()
                        .focus()
                        .setImage({ src: image.image_url })
                        .run();
                    previousSrcsRef.current = collectImageSrcs(editor);
                    const next = [...imagesRef.current, image];
                    imagesRef.current = next;
                    setImages(next);
                },
            });
        },
        [editor, noteId, uploadImage, setImages],
    );

    const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) handleImageUpload(file);
    };

    if (!editor) {
        return (
            <div className="w-full flex-1 text-slate-400 dark:text-gh-fg-subtle">
                Loading editor…
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 flex-1">
            {!isReadOnly && (
                <div className="flex items-center gap-1 flex-wrap border-b border-slate-200 dark:border-gh-border pb-2">
                    <ToolbarButton
                        label="Bold"
                        active={editor.isActive("bold")}
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                    >
                        <MdFormatBold size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Italic"
                        active={editor.isActive("italic")}
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                    >
                        <MdFormatItalic size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Heading"
                        active={editor.isActive("heading", { level: 2 })}
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                    >
                        <MdTitle size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Bulleted list"
                        active={editor.isActive("bulletList")}
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <MdFormatListBulleted size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Numbered list"
                        active={editor.isActive("orderedList")}
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <MdFormatListNumbered size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Quote"
                        active={editor.isActive("blockquote")}
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                    >
                        <MdFormatQuote size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Code block"
                        active={editor.isActive("codeBlock")}
                        onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                        }
                    >
                        <MdCode size={18} />
                    </ToolbarButton>
                    <span className="mx-1 w-px h-5 bg-slate-200 dark:bg-gh-border" />
                    <ToolbarButton
                        label="Insert image"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <MdImage size={18} />
                    </ToolbarButton>
                    <span className="mx-1 w-px h-5 bg-slate-200 dark:bg-gh-border" />
                    <ToolbarButton
                        label="Undo"
                        disabled={!editor.can().undo()}
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <MdUndo size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Redo"
                        disabled={!editor.can().redo()}
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <MdRedo size={18} />
                    </ToolbarButton>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onFilePick}
                        className="hidden"
                    />
                </div>
            )}

            <EditorContent editor={editor} className="flex-1" />
        </div>
    );
};

export default NoteArea;
