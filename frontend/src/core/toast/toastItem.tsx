import { MdCheckCircle, MdClose, MdError, MdInfo, MdWarning } from "react-icons/md";
import type { IToast } from "../../types";
import useToast from "../../hooks/toast.hook";

const ToastItem: React.FC<IToast> = ({ id, message, type }) => {
    const { removeToast } = useToast();

    const configs = {
        success: {
            icon: <MdCheckCircle className="text-green-500" size={24} />,
            bg: 'border-green-500/50 bg-green-50',
            text: 'text-green-800'
        },
        error: {
            icon: <MdError className="text-red-500" size={24} />,
            bg: 'border-red-500/50 bg-red-50',
            text: 'text-red-800'
        },
        warning: {
            icon: <MdWarning className="text-yellow-500" size={24} />,
            bg: 'border-yellow-500/50 bg-yellow-50',
            text: 'text-yellow-800'
        },
        info: {
            icon: <MdInfo className="text-blue-500" size={24} />,
            bg: 'border-blue-500/50 bg-blue-50',
            text: 'text-blue-800'
        }
    }

    const config = configs[type];

    return (
        <div className={`pointer-events-auto flex items-center p-4 rounded-lg border shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right-5 ${config.bg} ${config.text}`}>
            <div className="shrink-0">{config.icon}</div>
            <div className="ml-3 text-sm font-medium">{message}</div>
            <button className="ml-auto bg-transparent border-none p-1 hover:opacity-70 transition-opacity">
                <button
                    onClick={() => removeToast(id)}
                    className="ml-auto bg-transparent border-none p-1 hover:opacity-70
                           transition-opacity cursor-pointer flex items-center justify-center"
                >
                    <MdClose size={20} />
                </button>
            </button>
        </div>
    )
}

export default ToastItem;