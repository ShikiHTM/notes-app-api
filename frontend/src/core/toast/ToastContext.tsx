import { createContext, useState } from "react";
import type { IToast, ToastType } from "../../types";
import { ToastContainer } from "./ToastContainer";

interface IToastContext {
    showToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

export const ToastContext = createContext<IToastContext | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<IToast[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).slice(2, 9);
        const newToast = { id, message, type };
        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => removeToast(id), 2500);
    };

    const removeToast = (id: string) => {
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t)),
        );
        setTimeout(
            () => setToasts((prev) => prev.filter((t) => t.id !== id)),
            250,
        );
    };

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};
