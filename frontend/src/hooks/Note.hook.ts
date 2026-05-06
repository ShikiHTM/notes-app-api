import { useQuery } from "@tanstack/react-query";
import api from "../api/Axios";
import type { INote } from "../types";

export const notesQueryKey = ["notes"] as const;
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
