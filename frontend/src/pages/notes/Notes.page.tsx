import type React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { MdCreate, MdClose } from "react-icons/md";
import { CreateButton } from "../../components/ui/CreateButton.ui";
import { useNotes } from "../../hooks/Note.hook";
import { useLabels } from "../../hooks/Label.hook";
import type { INote } from "../../types";
import { DEFAULT_LABEL_COLOR } from "../../types";
import api from "../../api/Axios";

const NotesPage: React.FC = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const labelParam = params.get("label");
    const labelId = labelParam ? Number(labelParam) : null;
    const activeLabelId =
        labelId !== null && Number.isFinite(labelId) ? labelId : null;

    const { data: notes = [], isLoading } = useNotes(activeLabelId);
    const { data: labels = [] } = useLabels();
    const activeLabel = activeLabelId
        ? labels.find((l) => l.id === activeLabelId)
        : null;

    const pinned = notes.filter((note) => note.is_pinned);
    const others = notes.filter((note) => !note.is_pinned);

    const openNote = (note: INote) => navigate(`/notes/${note.id}`);
    const clearFilter = () => navigate("/notes");

    return (
        <div className="flex flex-col gap-4">
            {activeLabel && (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-gh-border bg-white dark:bg-gh-canvas-subtle px-3 py-2">
                    <span className="text-sm text-slate-500 dark:text-gh-fg-muted">
                        Lọc theo nhãn:
                    </span>
                    <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
                        style={{
                            backgroundColor:
                                activeLabel.color ?? DEFAULT_LABEL_COLOR,
                        }}
                    >
                        {activeLabel.name}
                    </span>
                    <button
                        type="button"
                        onClick={clearFilter}
                        className="ml-auto inline-flex items-center gap-1 text-sm text-slate-500 dark:text-gh-fg-muted hover:text-slate-800 dark:hover:text-gh-fg cursor-pointer"
                    >
                        <MdClose size={16} /> Bỏ lọc
                    </button>
                </div>
            )}

            {pinned.length > 0 && (
                <section>
                    <h1 className="text-2xl font-semibold text-indigo-600 dark:text-gh-accent mb-3">
                        Ghim
                    </h1>
                    <NoteGrid
                        notes={pinned}
                        onCardClick={openNote}
                        actionsContext="notes"
                    />
                </section>
            )}

            <h1 className="text-2xl font-semibold text-slate-800 dark:text-gh-fg">
                {activeLabel ? activeLabel.name : "Ghi chú"}
            </h1>
            <NoteGrid
                notes={others}
                onCardClick={openNote}
                emptyMessage={
                    activeLabel
                        ? "Chưa có ghi chú nào với nhãn này"
                        : "Chưa có ghi chú nào"
                }
                actionsContext="notes"
                isLoading={isLoading}
            />

            <CreateButton
                onClick={async () => {
                    const newNote = await api.post<INote>("/notes", {
                        title: "",
                        content: "",
                        is_pinned: false,
                        labels: activeLabelId ? [activeLabelId] : [],
                    });

                    navigate(`/notes/${newNote?.data.id}`);
                }}
                icon={<MdCreate size={24} />}
            />
        </div>
    );
};

export default NotesPage;
