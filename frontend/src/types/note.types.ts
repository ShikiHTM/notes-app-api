import type { IconType } from "react-icons";
import { FaTag, FaTrash } from "react-icons/fa";
import { MdArchive, MdNote } from "react-icons/md";
import type { ILabel } from "./label.types";
import type { INoteImage } from "./image.types";

export const NOTE_COLORS = [
    "RED",
    "CYAN",
    "YELLOW",
    "LIME",
    "PURPLE",
    "BLACK",
    "WHITE",
] as const;
export type NoteColor = (typeof NOTE_COLORS)[number];

export const NOTE_COLOR_CSS: Record<NoteColor, string> = {
    RED: "rgba(248, 113, 113, 0.20)",
    CYAN: "rgba(34, 211, 238, 0.20)",
    YELLOW: "rgba(250, 204, 21, 0.24)",
    LIME: "rgba(132, 204, 22, 0.22)",
    PURPLE: "rgba(168, 85, 247, 0.22)",
    BLACK: "rgba(15, 23, 42, 0.45)",
    WHITE: "rgba(255, 255, 255, 0.08)",
};

export const NOTE_COLOR_LABEL: Record<NoteColor, string> = {
    RED: "Red",
    CYAN: "Cyan",
    YELLOW: "Yellow",
    LIME: "Lime",
    PURPLE: "Purple",
    BLACK: "Black",
    WHITE: "White",
};

export interface INote {
    id: number;
    title: string;
    content: string | null;
    content_rich?: string | null;
    color?: NoteColor | null;
    is_pinned?: boolean;
    is_locked?: boolean;
    archived_at?: string | null;
    deleted_at?: string | null;
    created_at: string;
    updated_at: string;
    labels?: ILabel[];
    images?: INoteImage[];
    viewer_permission?: "OWNER" | "READ" | "READ_AND_WRITE" | null;
    shared_permission?: "READ" | "READ_AND_WRITE" | null;
    user?: {
        id: number;
        display_name: string;
        email: string;
        pfp_url?: string | null;
    };
}

export type EmptyVariant = "notes" | "archive" | "trash" | "labels";

export const emptyIcons: Record<EmptyVariant, IconType> = {
    notes: MdNote,
    labels: FaTag,
    archive: MdArchive,
    trash: FaTrash,
};
