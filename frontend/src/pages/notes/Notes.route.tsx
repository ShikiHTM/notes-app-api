import type { RouteObject } from "react-router-dom";
import NotesPage from "./Notes.page";

const NotesRoutes: RouteObject[] = [
    {
        path: 'notes',
        element: <NotesPage />
    }
];

export default NotesRoutes;
