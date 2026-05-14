import type { RouteObject } from "react-router-dom";
import LoginPage from "./LoginPage.auth";
import RegisterPage from "./RegisterPage.auth";
import VerifyPage from "./VerifyPage.auth";
import ResetPasswordPage from "./ResetPasswordPage.auth";
import ForgotPasswordPage from "./ForgotPasswordPage.auth";

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
        path: "forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "reset-password",
        element: <ResetPasswordPage />,
    },
];
