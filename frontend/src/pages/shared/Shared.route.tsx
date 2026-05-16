import type { RouteObject } from "react-router-dom";
import SharedPage from "./Shared.page";

const SharedRoutes: RouteObject[] = [
    {
        path: "shared",
        element: <SharedPage />,
    },
];

export default SharedRoutes;
