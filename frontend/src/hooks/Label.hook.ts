import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../api/Axios";
import type { ILabel } from "../types";
import useToast from "./Toast.hook";
import { notesQueryKey } from "./Note.hook";

export const labelsQueryKey = ["labels"] as const;

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
    }
    return fallback;
};

export const useLabels = () =>
    useQuery({
        queryKey: labelsQueryKey,
        queryFn: async () => {
            const res = await api.get<ILabel[]>("/labels");
            return res.data;
        },
    });

export const useCreateLabel = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (payload: { name: string; color?: string | null }) => {
            const res = await api.post<ILabel>("/labels", payload);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: labelsQueryKey });
            showToast("Đã tạo nhãn", "success");
        },
        onError: (error) =>
            showToast(extractErrorMessage(error, "Không thể tạo nhãn"), "error"),
    });
};

export const useUpdateLabel = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async ({
            id,
            ...payload
        }: {
            id: number;
            name: string;
            color?: string | null;
        }) => {
            const res = await api.put<ILabel>(`/labels/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: labelsQueryKey });
            qc.invalidateQueries({ queryKey: notesQueryKey });
            showToast("Đã cập nhật nhãn", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Không thể cập nhật nhãn"),
                "error",
            ),
    });
};

export const useDeleteLabel = () => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/labels/${id}`);
            return id;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: labelsQueryKey });
            qc.invalidateQueries({ queryKey: notesQueryKey });
            showToast("Đã xóa nhãn", "success");
        },
        onError: (error) =>
            showToast(extractErrorMessage(error, "Không thể xóa nhãn"), "error"),
    });
};
