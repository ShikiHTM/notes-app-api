import type { RouteObject } from "react-router-dom";
import TrashPage from "./Trash.page";

const TrashRoutes: RouteObject[] = [
    {
        path: "trash",
        element: <TrashPage />,
    },
];

export default TrashRoutes;
