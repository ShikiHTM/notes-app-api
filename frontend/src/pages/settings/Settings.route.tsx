import type { RouteObject } from "react-router-dom";
import SettingsPage from "./Settings.page";

const SettingsRoutes: RouteObject[] = [
    {
        'path': 'settings',
        'element': <SettingsPage />
    }
]

export default SettingsRoutes;