import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../api/Axios";
import type { INote } from "../types";
import useToast from "./Toast.hook";
import {
    noteQueryKey,
    notesQueryKey,
    archivedNotesQueryKey,
    trashedNotesQueryKey,
} from "./Note.hook";

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

const invalidateLists = (qc: ReturnType<typeof useQueryClient>) => {
    qc.invalidateQueries({ queryKey: notesQueryKey });
    qc.invalidateQueries({ queryKey: archivedNotesQueryKey });
    qc.invalidateQueries({ queryKey: trashedNotesQueryKey });
};

interface ISetPasswordPayload {
    noteId: number;
    password: string;
    currentPassword?: string;
}

interface IRemovePasswordPayload {
    noteId: number;
    currentPassword: string;
}

export const useSetNotePassword = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            noteId,
            password,
            currentPassword,
        }: ISetPasswordPayload) => {
            const res = await api.put<INote>(`/notes/${noteId}`, {
                password,
                current_password: currentPassword ?? null,
            });
            return res.data;
        },
        onSuccess: (note) => {
            qc.setQueryData(noteQueryKey(note.id), note);
            invalidateLists(qc);
            showToast("Password set", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Failed to set password"),
                "error",
            ),
    });
};

export const useRemoveNotePassword = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            noteId,
            currentPassword,
        }: IRemovePasswordPayload) => {
            const res = await api.put<INote>(`/notes/${noteId}`, {
                password: null,
                current_password: currentPassword,
            });
            return res.data;
        },
        onSuccess: (note) => {
            qc.setQueryData(noteQueryKey(note.id), note);
            invalidateLists(qc);
            showToast("Password removed", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Failed to remove password"),
                "error",
            ),
    });
};

interface IUnlockPayload {
    noteId: number;
    password: string;
}

export const useUnlockNote = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ noteId, password }: IUnlockPayload) => {
            const res = await api.post<INote>(`/notes/${noteId}/unlock`, {
                password,
            });
            return res.data;
        },
        onSuccess: (note) => {
            qc.setQueryData(noteQueryKey(note.id), note);
        },
    });
};
