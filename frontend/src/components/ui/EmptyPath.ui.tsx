import type React from "react";
import { emptyIcons, type EmptyVariant } from "../../types";

interface IEmptyPathProps {
    message?: String;
    variant: EmptyVariant;
}

export const EmptyPath: React.FC<IEmptyPathProps> = ({ message, variant }) => {
    const Icon = emptyIcons[variant];

    return (
        <div className="flex items-center justify-center py-20 text-slate-400">
            <div className="flex flex-col items-center gap-4">
                <Icon size={48} />
                {message && <p>{message}</p>}
            </div>
        </div>
    )
}