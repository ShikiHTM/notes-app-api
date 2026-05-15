export interface IUser {
    id: number;
    display_name: string;
    email: string;
    pfp_url?: string | null;
    pfp_public_id?: string | null;
    email_verified_at?: string | null;
    updated_at: string;
    created_at: string;
}
