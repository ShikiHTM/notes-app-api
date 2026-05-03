export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface IToast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}