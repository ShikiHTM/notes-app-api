import type React from "react";

const NoteSkeleton: React.FC = () => {
    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-gh-border pb-2">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
                </div>
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
            </div>

            <div className="h-8 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />

            <div className="flex flex-col gap-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-gh-canvas-inset" />
            </div>
        </div>
    );
};

export default NoteSkeleton;
