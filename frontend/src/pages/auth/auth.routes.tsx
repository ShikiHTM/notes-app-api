import type { RouteObject } from "react-router-dom";
import LoginPage from "./LoginPage.auth";
import RegisterPage from "./RegisterPage.auth";

export const authRoutes: RouteObject[] = [
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "register",
        element: <RegisterPage />,
    },
];
