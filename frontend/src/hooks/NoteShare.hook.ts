import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../api/Axios";
import type {
    INote,
    INoteShare,
    IShareNoteResponse,
    SharePermission,
} from "../types";
import useToast from "./Toast.hook";

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.errors && typeof data.errors === "object") {
            const first = Object.values(data.errors)[0];
            if (Array.isArray(first) && typeof first[0] === "string") {
                return first[0];
            }
        }
        if (typeof data?.message === "string") return data.message;
        if (typeof data?.error === "string") return data.error;
    }
    return fallback;
};

export const sharedWithMeQueryKey = ["notes", "shared-with-me"] as const;
export const noteSharesQueryKey = (noteId: number) =>
    ["note", String(noteId), "shares"] as const;

export const useNoteShares = (noteId: number, enabled = true) =>
    useQuery({
        queryKey: noteSharesQueryKey(noteId),
        queryFn: async () => {
            const res = await api.get<INoteShare[]>(`/notes/${noteId}/shares`);
            return res.data;
        },
        enabled: enabled && noteId > 0,
    });

export const useSharedWithMe = () =>
    useQuery({
        queryKey: sharedWithMeQueryKey,
        queryFn: async () => {
            const res = await api.get<INote[]>("/notes/shared-with-me");
            return res.data;
        },
    });

interface IShareNotePayload {
    noteId: number;
    emails: string[];
    permission: SharePermission;
}

export const useShareNote = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            noteId,
            emails,
            permission,
        }: IShareNotePayload) => {
            const res = await api.post<IShareNoteResponse>(
                `/notes/${noteId}/shares`,
                { emails, permission },
            );
            return res.data;
        },
        onSuccess: (data, vars) => {
            qc.invalidateQueries({ queryKey: noteSharesQueryKey(vars.noteId) });

            const parts: string[] = [];
            if (data.added.length > 0)
                parts.push(`Shared with ${data.added.length} ${data.added.length === 1 ? "person" : "people"}`);
            if (data.updated.length > 0)
                parts.push(`Updated ${data.updated.length} ${data.updated.length === 1 ? "permission" : "permissions"}`);
            if (data.not_found.length > 0)
                parts.push(
                    `${data.not_found.length} ${data.not_found.length === 1 ? "email is" : "emails are"} not registered: ${data.not_found.join(", ")}`,
                );

            if (data.not_found.length > 0 && data.added.length === 0 && data.updated.length === 0) {
                showToast(parts.join(". "), "error");
            } else {
                showToast(parts.join(". ") || "Updated", "success");
            }
        },
        onError: (error) =>
            showToast(extractErrorMessage(error, "Failed to share"), "error"),
    });
};

interface IUpdateSharePayload {
    noteId: number;
    userId: number;
    permission: SharePermission;
}

export const useUpdateShare = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            noteId,
            userId,
            permission,
        }: IUpdateSharePayload) => {
            await api.put(`/notes/${noteId}/shares/${userId}`, { permission });
            return { noteId, userId, permission };
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: noteSharesQueryKey(data.noteId) });
            showToast("Permission updated", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Failed to update permission"),
                "error",
            ),
    });
};

interface IRevokeSharePayload {
    noteId: number;
    userId: number;
}

export const useRevokeShare = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({ noteId, userId }: IRevokeSharePayload) => {
            await api.delete(`/notes/${noteId}/shares/${userId}`);
            return { noteId, userId };
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: noteSharesQueryKey(data.noteId) });
            showToast("Access revoked", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Failed to revoke access"),
                "error",
            ),
    });
};
