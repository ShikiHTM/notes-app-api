import { useNavigate } from "react-router-dom";
import api from "../../api/axios"
import type { ILoginRequest, ILoginResponse } from "../../types/auth.types"
import LoginCard from "../../components/loginCard";
import { useState } from "react";
import useToast from "../../hooks/toast.hook";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (data: ILoginRequest) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', data) as ILoginResponse;

            console.log(response);

            localStorage.setItem('access_token', response.token);

            showToast('Đăng nhập thành công!', 'success');

            setTimeout(() => {
                navigate('/');
            }, 1500);

        }catch(error) {
            showToast('Sai email hoặc mật khẩu', 'error');
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center" style={{
            backgroundColor: '#f3f4f6',
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)'
        }}>
            <LoginCard
                onLogin={handleLogin}
                isLoading={isLoading}
            />
        </div>
    )
}