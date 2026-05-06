import type { RouteObject } from "react-router-dom";
import NotesPage from "./Notes.page";
import NoteEditorPage from "./NoteEditor.page";

const NotesRoutes: RouteObject[] = [
    {
        path: 'notes',
        element: <NotesPage />
    },
    {
        path: 'notes/:id',
        element: <NoteEditorPage />
    }
];

export default NotesRoutes;
