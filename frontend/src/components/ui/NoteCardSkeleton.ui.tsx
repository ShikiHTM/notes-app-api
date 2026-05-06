import type React from "react";

const NoteCardSkeleton: React.FC = () => (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <div className="h-5 w-3/5 animate-pulse rounded bg-slate-200" />
        <div className="flex flex-col gap-1.5 pt-1">
            <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-11/12 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>
    </div>
);

export default NoteCardSkeleton;
