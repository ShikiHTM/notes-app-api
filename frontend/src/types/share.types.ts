export type SharePermission = "READ" | "READ_AND_WRITE";
export type ViewerPermission = "OWNER" | "READ" | "READ_AND_WRITE" | null;

export interface INoteShare {
    user_id: number;
    display_name: string;
    email: string;
    pfp_url?: string | null;
    permission: SharePermission;
    shared_at: string;
}

export interface IShareNoteResponse {
    message: string;
    added: string[];
    updated: string[];
    not_found: string[];
}
