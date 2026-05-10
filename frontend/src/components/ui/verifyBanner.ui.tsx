import React from "react";
import { PiWarningFill } from "react-icons/pi";
import { useAuth } from "../../hooks/Auth.hook";

const VerifyBanner: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className={`w-full min-h-10 flex justify-center items-center bg-amber-400 text-white dark:bg-gh-attention ${user?.email_verified_at ? 'hidden' : ''}`}>
            <div className="flex gap-2">
                {/* Logo */}
                <PiWarningFill size={24} />

                <p className="font-medium">Vui lòng xác minh địa chỉ email của bạn tại <button
                    className="text-blue-600 font-medium hover:text-blue-900 bg-transparent underline cursor-pointer"
                    onClick={() => {
                    }}
                >đây
                </button></p>
            </div>
        </div>
    )
}

export default VerifyBanner
