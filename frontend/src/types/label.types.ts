export interface ILabel {
    id: number;
    user_id: number;
    name: string;
    color?: string | null;
}

export const DEFAULT_LABEL_COLOR = "#6366f1";

export const LABEL_COLOR_PRESETS: string[] = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#a855f7",
    "#ec4899",
    "#64748b",
];
