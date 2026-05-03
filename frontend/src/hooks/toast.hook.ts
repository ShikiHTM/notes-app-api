import React from 'react';
import { ToastContext } from '../core/toast/toastContext';

export default function useToast() {
    const context = React.useContext(ToastContext);
    if(!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}