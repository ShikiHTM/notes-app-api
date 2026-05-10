import type { RouteObject } from "react-router-dom";
import LoginPage from "./LoginPage.auth";
import RegisterPage from "./RegisterPage.auth";
import VerifyPage from "./VerifyPage.auth";
import ResetPasswordPage from "./ResetPasswordPage.auth";

export const authRoutes: RouteObject[] = [
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "register",
        element: <RegisterPage />,
    },
    {
        path: "verify",
        element: <VerifyPage />,
    },
    {
        path: "reset-password",
        element: <ResetPasswordPage />,
    },
];
