import type React from "react";

interface ICreateButtonProps {
    onClick: () => void;
    icon?: React.ReactNode;
    buttonColor?: string;
}

export const CreateButton: React.FC<ICreateButtonProps> = ({ onClick, icon, buttonColor }) => {
    return (
        <button
            className={`fixed bottom-6 right-6 ${buttonColor || "bg-indigo-400"} text-white rounded-full p-4 shadow-lg hover:scale-105 hover:shadow-xl ease-in-out duration-300 transition cursor-pointer`}
            onClick={onClick}
        >
            {icon || '+'}
        </button>
    );
}