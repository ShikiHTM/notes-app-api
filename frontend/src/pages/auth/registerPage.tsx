import { useState } from "react";
import useToast from "../../hooks/toast.hook";
import { useNavigate } from "react-router-dom";
import type { IRegisterRequest, IRegisterResponse } from "../../types";
import api from "../../api/axios";
import RegisterCard from "../../components/registerCard";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async(data: IRegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', data) as IRegisterResponse;

            localStorage.setItem('access_token', response.token);

            showToast('Đăng ký thành công!', 'success');

            setTimeout(() => {
                navigate('/login');
            }, 1000)
        }catch(error) {
            showToast(`Internal Server Error.`, 'error');
            console.error(error);
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