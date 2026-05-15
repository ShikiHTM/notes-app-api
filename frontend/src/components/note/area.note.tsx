import { useCallback, useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
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
    const { note, isReadOnly, updateContent, save } = useNoteContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previousSrcsRef = useRef<Set<string>>(new Set());

    const noteId = note?.id ?? 0;
    const { mutate: uploadImage, isPending: isUploading } =
        useUploadNoteImage(noteId);
    const { mutate: deleteImageById } = useDeleteNoteImage(noteId);

    const initialContent = useMemo(() => {
        if (!note) return "";
        if (note.content_rich) {
            try {
                return JSON.parse(note.content_rich);
            } catch {
                /* fall through to plain content */
            }
        }
        // Wrap legacy plain text as a single paragraph
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
            : "";
    }, [note?.id]);

    const editor = useEditor(
        {
            extensions: [
                StarterKit,
                Image.configure({ inline: false, allowBase64: false }),
                Placeholder.configure({ placeholder: "Nội dung ghi chú…" }),
            ],
            content: initialContent,
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

                // Detect images removed from the doc and delete them on the server.
                const current = collectImageSrcs(e);
                const removed = [...previousSrcsRef.current].filter(
                    (src) => !current.has(src),
                );
                previousSrcsRef.current = current;

                if (removed.length > 0 && note?.images) {
                    for (const src of removed) {
                        const match = note.images.find(
                            (img) => img.image_url === src,
                        );
                        if (match) deleteImageById(match.id);
                    }
                }
            },
            onBlur: () => {
                save();
            },
        },
        [note?.id],
    );

    // Keep editable in sync if note becomes read-only
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
                },
            });
        },
        [editor, noteId, uploadImage],
    );

    const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) handleImageUpload(file);
    };

    if (!editor) {
        return (
            <div className="w-full flex-1 text-slate-400 dark:text-gh-fg-subtle">
                Đang tải trình soạn thảo…
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 flex-1">
            {!isReadOnly && (
                <div className="flex items-center gap-1 flex-wrap border-b border-slate-200 dark:border-gh-border pb-2">
                    <ToolbarButton
                        label="In đậm"
                        active={editor.isActive("bold")}
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                    >
                        <MdFormatBold size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="In nghiêng"
                        active={editor.isActive("italic")}
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                    >
                        <MdFormatItalic size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Tiêu đề"
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
                        label="Danh sách"
                        active={editor.isActive("bulletList")}
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <MdFormatListBulleted size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Danh sách có thứ tự"
                        active={editor.isActive("orderedList")}
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                    >
                        <MdFormatListNumbered size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Trích dẫn"
                        active={editor.isActive("blockquote")}
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                    >
                        <MdFormatQuote size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Khối mã"
                        active={editor.isActive("codeBlock")}
                        onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                        }
                    >
                        <MdCode size={18} />
                    </ToolbarButton>
                    <span className="mx-1 w-px h-5 bg-slate-200 dark:bg-gh-border" />
                    <ToolbarButton
                        label="Chèn ảnh"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <MdImage size={18} />
                    </ToolbarButton>
                    <span className="mx-1 w-px h-5 bg-slate-200 dark:bg-gh-border" />
                    <ToolbarButton
                        label="Hoàn tác"
                        disabled={!editor.can().undo()}
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <MdUndo size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        label="Làm lại"
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
