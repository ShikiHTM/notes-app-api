import type { RouteObject } from "react-router-dom";
import LoginPage from "./loginPage";
import RegisterPage from "./registerPage";

export const authRoutes: RouteObject[] = [
    {
        'path': 'login',
        'element': <LoginPage />
    },
    {
        'path': 'register',
        'element': <RegisterPage />
    }
]