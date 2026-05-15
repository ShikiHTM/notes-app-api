import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../api/Axios";
import type { INote, INoteImage } from "../types";
import useToast from "./Toast.hook";
import { noteQueryKey, notesQueryKey } from "./Note.hook";

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

interface IUploadResponse {
    message: string;
    image: INoteImage;
}

export const useUploadNoteImage = (noteId: number) => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (file: File) => {
            const form = new FormData();
            form.append("note_id", String(noteId));
            form.append("image_url", file);
            const res = await api.post<IUploadResponse>("/images", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.image;
        },
        onSuccess: (image) => {
            qc.setQueryData<INote>(noteQueryKey(noteId), (old) =>
                old
                    ? { ...old, images: [...(old.images ?? []), image] }
                    : old,
            );
            qc.invalidateQueries({ queryKey: notesQueryKey });
            showToast("Đã tải ảnh", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Không thể tải ảnh"),
                "error",
            ),
    });
};

export const useDeleteNoteImage = (noteId: number) => {
    const qc = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (imageId: number) => {
            await api.delete(`/images/${imageId}`);
            return imageId;
        },
        onSuccess: (imageId) => {
            qc.setQueryData<INote>(noteQueryKey(noteId), (old) =>
                old
                    ? {
                          ...old,
                          images: (old.images ?? []).filter(
                              (img) => img.id !== imageId,
                          ),
                      }
                    : old,
            );
            qc.invalidateQueries({ queryKey: notesQueryKey });
            showToast("Đã xóa ảnh", "success");
        },
        onError: (error) =>
            showToast(
                extractErrorMessage(error, "Không thể xóa ảnh"),
                "error",
            ),
    });
};
