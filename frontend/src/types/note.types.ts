import type { IconType } from "react-icons";
import { FaTag, FaTrash } from "react-icons/fa";
import { MdArchive, MdNote } from "react-icons/md";

export interface INote {
    id: number;
    title: string;
    content: string;
    color?: string | null;
    is_pinned?: boolean;
    is_archived?: boolean;
    deleted_at?: string | null;
    created_at: string;
    updated_at: string;
}

export type EmptyVariant = "notes" | "archive" | "trash" | "labels";

export const emptyIcons: Record<EmptyVariant, IconType> = {
    notes: MdNote,
    labels: FaTag,
    archive: MdArchive,
    trash: FaTrash
}