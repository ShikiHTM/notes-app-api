import type { IToast } from "../../types";
import ToastItem from "./ToastItem";

interface IToastContainer {
    toasts: IToast[];
}

export const ToastContainer: React.FC<IToastContainer> = ({ toasts }) => {
    return (
        <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 w-full max-w-xs pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} {...toast} />
            ))}
        </div>
    )
}
