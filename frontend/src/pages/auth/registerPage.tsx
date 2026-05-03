import { useState } from "react";
import useToast from "../../hooks/toast.hook";
import { useNavigate } from "react-router-dom";
import type { IAuthResponse, IRegisterRequest } from "../../types";
import api from "../../api/Axios";
import RegisterCard from "../../components/auth/RegisterCard";
import { isAxiosError } from "axios";
import { useAuth } from "../../hooks/auth.hook";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async(data: IRegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', data);

            const authData: IAuthResponse = response.data;

            login(authData.token, authData.user);

            showToast('Đăng ký thành công!', 'success');

            setTimeout(() => {
                navigate('/login');
            }, 1000)
        }catch(error) {
            if(isAxiosError(error)) {
                const serverMessage = error.response?.data?.message;
                const validationErrors = error.response?.data?.errors;

                showToast(serverMessage, 'error');
                console.error(validationErrors);
            } else {
                showToast('Internal Server Error', 'error');
            }
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center" style={{
            backgroundColor: '#f3f4f6',
            backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)'
        }}>
            <RegisterCard
                onRegister={handleRegister}
                isLoading={isLoading}
            />
        </div>
    )
}
