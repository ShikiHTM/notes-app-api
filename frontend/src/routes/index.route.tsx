import { Navigate, type RouteObject } from "react-router-dom";
import { authRoutes } from "../pages/auth/auth.routes";
import Layout from "../layout";
import SettingsRoutes from "../pages/settings/Settings.route";
import NotesRoutes from "../pages/notes/Notes.route";
import LabelsRoutes from "../pages/labels/Labels.route";
import ArchiveRoutes from "../pages/archive/Archive.route";
import TrashRoutes from "../pages/trash/Trash.route";

export const AppRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/notes" replace /> },
            ...authRoutes,
            ...SettingsRoutes,
            ...NotesRoutes,
            ...LabelsRoutes,
            ...ArchiveRoutes,
            ...TrashRoutes,
        ],
    },
];
