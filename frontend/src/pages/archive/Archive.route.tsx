import type { RouteObject } from "react-router-dom";
import ArchivePage from "./Archive.page";

const ArchiveRoutes: RouteObject[] = [
    {
        path: "archive",
        element: <ArchivePage />,
    },
];

export default ArchiveRoutes;
