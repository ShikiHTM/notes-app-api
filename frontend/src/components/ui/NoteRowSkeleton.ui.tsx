import type React from "react";

const NoteRowSkeleton: React.FC = () => (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white dark:border-gh-border dark:bg-gh-canvas-subtle px-4 py-3">
        <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
        </div>
    </div>
);

export default NoteRowSkeleton;
