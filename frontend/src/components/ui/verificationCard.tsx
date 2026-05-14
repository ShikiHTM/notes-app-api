import React from "react";
import { IoWarning } from "react-icons/io5";

export const verificationBar: React.FC = () => {
    return (
        <div className="w-full min-h-5 top-0 bg-yellow-400/40 flex justify-center align-center">
            {/* Icon */}
            <div className="color-slate-200 dark:color-gray-700">
                <IoWarning size={24} />
            </div>
        </div>
    );
};
