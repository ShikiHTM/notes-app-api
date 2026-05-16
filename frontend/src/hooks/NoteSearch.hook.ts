import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../api/Axios";
import type { INote } from "../types";

export const noteSearchQueryKey = (q: string) =>
    ["notes", "search", q] as const;

export const useSearchNotes = (q: string) => {
    const query = q.trim();
    return useQuery({
        queryKey: noteSearchQueryKey(query),
        queryFn: async () => {
            const res = await api.get<INote[]>("/notes/search", {
                params: { q: query },
            });
            return res.data;
        },
        enabled: query.length > 0,
        placeholderData: keepPreviousData,
    });
};
