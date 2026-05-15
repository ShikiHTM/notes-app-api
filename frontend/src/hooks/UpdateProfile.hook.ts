import useToast from "./Toast.hook";
import api from "../api/Axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { IUser } from "../types";
import { useAuth } from "./Auth.hook";

export interface IUpdateProfilePayload {
    name?: string;
    email?: string;
}

const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof AxiosError) {
        const data = error.response?.data;
        if (data?.errors && typeof data.errors === "object") {
            const first = Object.values(data.errors)[0];
            if (Array.isArray(first) && typeof first[0] === "string") {
                return first[0];
            }
        }
        if (typeof data?.message === "string") {
            return data.message;
        }
    }
    return fallback;
};

export const useUpdateProfile = () => {
    const { showToast } = useToast();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: async (payload: IUpdateProfilePayload) => {
            const response = await api.patch<IUser>("/user", payload);
            return response.data;
        },
        onSuccess: (user) => {
            setUser(user);
            showToast("Cập nhật thông tin thành công", "success");
        },
        onError: (error) => {
            showToast(
                extractErrorMessage(error, "Cập nhật thông tin thất bại"),
                "error",
            );
        },
    });
};

export const useUpdateAvatar = () => {
    const { showToast } = useToast();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: async (file: File) => {
            const form = new FormData();
            form.append("avatar", file);
            const response = await api.post<IUser>("/user/avatar", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        },
        onSuccess: (user) => {
            setUser(user);
            showToast("Cập nhật ảnh đại diện thành công", "success");
        },
        onError: (error) => {
            showToast(
                extractErrorMessage(error, "Tải ảnh đại diện thất bại"),
                "error",
            );
        },
    });
};
