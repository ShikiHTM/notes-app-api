import type React from "react";
import { useNavigate } from "react-router-dom";
import NoteGrid from "../../components/ui/NoteGrid.ui";
import { MdCreate } from "react-icons/md";
import { CreateButton } from "../../components/ui/CreateButton.ui";
import { useNotes } from "../../hooks/Note.hook";
import type { INote } from "../../types";
import api from "../../api/Axios";

const NotesPage: React.FC = () => {
    const { data: notes = [], isLoading } = useNotes();
    const navigate = useNavigate();

    const pinned = notes.filter(note => note.is_pinned);
    const others = notes.filter(note => !note.is_pinned);

    const openNote = (note: INote) => navigate(`/notes/${note.id}`);

    return (
        <div className="flex flex-col gap-4">
            {pinned.length > 0 && (
                <section>
                    <h1 className="text-2xl font-semibold text-indigo-600 mb-3">Ghim</h1>
                    <NoteGrid notes={pinned} onCardClick={openNote} actionsContext="notes" />
                </section>
            )}

            <h1 className="text-2xl font-semibold text-slate-800">Ghi chú</h1>
            <NoteGrid notes={others} onCardClick={openNote} emptyMessage="Chưa có ghi chú nào" actionsContext="notes" isLoading={isLoading} />

            <CreateButton
                onClick={async () => {
                    const newNote = await api.post<INote>("/notes", {
                        title: "",
                        content: "",
                        is_pinned: false,
                        labels: []
                    });

                    navigate(`/notes/${newNote?.data.id}`)
                }}
                icon={<MdCreate size={24}/>}
            />
        </div>
    );
};

export default NotesPage;
