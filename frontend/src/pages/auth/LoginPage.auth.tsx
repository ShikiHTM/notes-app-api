import { useNavigate } from "react-router-dom";
import api from "../../api/Axios";
import type { ILoginRequest, IAuthResponse } from "../../types/auth.types";
import { useState } from "react";
import useToast from "../../hooks/Toast.hook";
import { useAuth } from "../../hooks/Auth.hook";
import LoginCard from "../../components/auth/LoginCard.auth";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (data: ILoginRequest) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", data);

            const authData: IAuthResponse = response.data;

            login(authData.token, authData.user);

            showToast("Signed in successfully!", "success");

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            showToast("Incorrect email or password", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gh-canvas"
            style={{
                backgroundImage:
                    "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)",
            }}
        >
            <LoginCard onLogin={handleLogin} isLoading={isLoading} />
        </div>
    );
}
