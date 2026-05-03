import { type RouteObject } from "react-router-dom";
import { authRoutes } from "../pages/auth/auth.routes";
import Layout from "../layout";

export const AppRoutes: RouteObject = {
    'path': '/',
    'element': <Layout />,
    'children': [
        ...authRoutes
    ]
}