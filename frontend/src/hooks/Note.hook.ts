import { useQuery } from "@tanstack/react-query";
import api from "../api/Axios";
import type { INote } from "../types";

export const notesQueryKey = ["notes"] as const;
export const archivedNotesQueryKey = ["notes", "archived"] as const;
export const trashedNotesQueryKey = ["notes", "trashed"] as const;
export const noteQueryKey = (id: number | string) => ["note", String(id)] as const;

export const useNotes = () => {
    return useQuery({
        queryKey: notesQueryKey,
        queryFn: async () => {
            const res = await api.get<INote[]>("/notes");
            return res.data;
        },
    });
};

export const useArchivedNotes = () => {
    return useQuery({
        queryKey: archivedNotesQueryKey,
        queryFn: async () => {
            const res = await api.get<INote[]>("/notes/archived");
            return res.data;
        },
    });
};

export const useTrashedNotes = () => {
    return useQuery({
        queryKey: trashedNotesQueryKey,
        queryFn: async () => {
            const res = await api.get<INote[]>("/notes/trashed");
            return res.data;
        },
    });
};

export const useNote = (id: number) => {
    return useQuery({
        queryKey: noteQueryKey(id),
        queryFn: async () => {
            const res = await api.get<INote>(`/notes/${id}`);
            return res.data;
        },
        enabled: Number.isFinite(id),
    });
};
