import type { RouteObject } from "react-router-dom";
import LabelsPage from "./Labels.page";

const LabelsRoutes: RouteObject[] = [
    {
        path: 'labels',
        element: <LabelsPage />
    }
];

export default LabelsRoutes;
