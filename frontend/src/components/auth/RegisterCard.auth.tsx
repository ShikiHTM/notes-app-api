import type React from "react";
import type { IRegisterCardProps, IRegisterRequest } from "../../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdAccountCircle, MdEmail, MdLock, MdNoteAlt, MdVisibility, MdVisibilityOff } from "react-icons/md";

const RegisterCard: React.FC<IRegisterCardProps> = ({ onRegister, isLoading }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IRegisterRequest>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<{ display_name?: string; email?: string; password?: string; confirmPassword?: string }>({});

    const validate = () => {
        const newErrors: { display_name?: string; email?: string; password?: string; confirmPassword?: string } = {};

        if(!formData?.display_name) {
            newErrors.display_name = 'Tên người dùng không được để trống';
        }else if (formData?.display_name.length < 3) {
            newErrors.display_name = 'Tên người dùng không được nhỏ hơn 3 ký tự';
        }

        if(!formData?.email) {
            newErrors.email = 'Email không được để trống';
        } else if(!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if(!formData?.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if(formData.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        }

        if(confirmPassword !== formData?.password) {
            newErrors.confirmPassword = 'Mật khẩu không trùng khớp'
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formData);
        if(validate()) {
            onRegister(formData!);
        }
    }

    return (
        <div className="w-full max-w-105 bg-white rounded-lg shadow-lg p-8">
            {/* Logo */}
            <div className="text-white w-10 h-10 rounded-lg flex items-center justify-center m-auto" style={{
                backgroundColor: '#6366f1'
            }}>
                <MdNoteAlt size={30} />
            </div>

            <h2 className="font-bold text-gray-800 text-center mt-2 mb-2 text-4xl">Chào mừng trở lại</h2>
            <p className="text-gray-400 text-center text-sm mb-8">Vui lòng đăng nhập để tiếp tục</p>

            <form onSubmit={handleSubmit}>
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdAccountCircle
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="User Name"
                            className="w-full block pl-12 pr-4 py-4
                                    bg-white border border-slate-200 rounded-xl
                                    text-slate-900 placeholder:text-slate-400
                                    focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                                    transition-all duration-200 shadow-sm"
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    display_name: e.target.value
                                }))
                            }}
                        />
                        </div>
                        {error.display_name && (
                            <span className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
                                {error.display_name}
                            </span>
                        )}
                </div>
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdEmail
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full block pl-12 pr-4 py-4
                                    bg-white border border-slate-200 rounded-xl
                                    text-slate-900 placeholder:text-slate-400
                                    focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                                    transition-all duration-200 shadow-sm"
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    email: e.target.value
                                }))
                            }}
                        />
                    </div>
                    {error.email && (
                        <span className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
                            {error.email}
                        </span>
                    )}
                </div>
                <div className="w-full gap-5 px-4 mb-3 sm:px-0">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdLock
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                            />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full block pl-12 pr-4 py-4
                                    bg-white border border-slate-200 rounded-xl
                                    text-slate-900 placeholder:text-slate-400
                                    focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                                    transition-all duration-200 shadow-sm"
                            onChange={(e) => {
                                setFormData((prev) => ({
                                    ...prev!,
                                    password: e.target.value
                                }))
                            }}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 -translate-1/2 text-slate-400 shadow-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <MdVisibilityOff size={20}/> : <MdVisibility size={20}/>}
                        </button>
                    </div>
                    {error.password && (
                        <span className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
                            {error.password}
                        </span>
                    )}
                </div>
                <div className="w-full gap-5 px-4 sm:px-0">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <MdLock
                                className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                            />
                        </div>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="w-full block pl-12 pr-4 py-4
                                    bg-white border border-slate-200 rounded-xl
                                    text-slate-900 placeholder:text-slate-400
                                    focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
                                    transition-all duration-200 shadow-sm"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 -translate-1/2 text-slate-400 shadow-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <MdVisibilityOff size={20}/> : <MdVisibility size={20}/>}
                        </button>
                    </div>
                    {error.confirmPassword && (
                        <span className="text-xs text-red-500 mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
                            {error.confirmPassword}
                        </span>
                    )}
                </div>

                <button type="submit" className="
                    w-full mt-5 flex items-center justify-center text-white
                    bg-indigo-600 p-4 rounded-xl font-semibold cursor-pointer
                    shadow-lg shadow-indigo-200

                    ring-indigo-500/0 ring-0

                    hover:bg-indigo-700 hover:ring-2 hover:ring-indigo-500/30

                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50

                    active:scale-[0.98]

                    transition-all duration-300 ease-out
                ">
                    {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
            </form>

            {/* Footer */}
            <p className="text-gray-400 text-center text-sm mt-6">
                Đã có tài khoản?{' '}
                <span
                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors"
                    onClick={() => navigate('/login')}
                >
                    Đăng nhập ngay
                </span>
            </p>
        </div>
    )
}

export default RegisterCard;
