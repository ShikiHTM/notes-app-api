import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    size?: ModalSize;
    closeOnBackdrop?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;
    className?: string;
}

const SIZE_CLASS: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[95vh]",
};

export const Modal: React.FC<IModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    closeOnBackdrop = true,
    closeOnEsc = true,
    showCloseButton = true,
    className = "",
}) => {
    useEffect(() => {
        if (!isOpen || !closeOnEsc) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, closeOnEsc, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-9999 bg-black/70 backdrop-blur-sm"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            <div
                className="fixed inset-0 z-10000 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className={`bg-white text-slate-800 w-full ${SIZE_CLASS[size]} max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${className}`}
                    onClick={e => e.stopPropagation()}
                >
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <div className="text-lg font-semibold">{title}</div>
                            {showCloseButton && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="p-1 rounded-full hover:bg-slate-100 transition"
                                >
                                    <IoMdClose size={22} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {children}
                    </div>

                    {footer && (
                        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
