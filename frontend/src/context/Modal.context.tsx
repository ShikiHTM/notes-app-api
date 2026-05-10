import React, { useCallback } from "react";
import Modal from "../components/modal/Modal.modal";

interface IConfirmOpts {
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
}

interface IModalContextType {
    confirm: (opts: IConfirmOpts) => Promise<boolean>;
}

export const ModalContext = React.createContext<IModalContextType | undefined>(
    undefined,
);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<{
        opts: IConfirmOpts;
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = useCallback((opts: IConfirmOpts) => {
        return new Promise<boolean>((resolve) => {
            setState({ opts, resolve });
        });
    }, []);

    const close = (v: boolean) => {
        state?.resolve(v);
        setState(null);
    };

    return (
        <ModalContext.Provider value={{ confirm }}>
            {children}
            <Modal
                isOpen={!!state}
                onClose={() => close(false)}
                title={state?.opts.title || "Xác nhận"}
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => close(false)}
                            className="px-4 py-2 rounded hover:bg-slate-100 dark:hover:bg-gh-canvas-inset dark:text-gh-fg"
                        >
                            {state?.opts.cancelText || "Hủy"}
                        </button>
                        <button
                            onClick={() => close(true)}
                            className={`px-4 py-2 rounded ${state?.opts.confirmColor || "bg-indigo-500"} text-white`}
                        >
                            {state?.opts.confirmText || "Xác nhận"}
                        </button>
                    </>
                }
            >
                {state?.opts.message}
            </Modal>
        </ModalContext.Provider>
    );
}
