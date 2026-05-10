import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../api/Axios";
import useToast from "./Toast.hook";

export const useRequestPasswordReset = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async (password: string) => {
            const response = await api.post("/auth/request-password-reset", { password });
            return response.data;
        },
        onSuccess: () => {
            showToast("Email đặt lại mật khẩu đã được gửi!", "success");
        },
        onError: (error) => {
            let message = "Gửi email thất bại";
            if (error instanceof AxiosError && error.response?.data?.message) {
                message = error.response.data.message;
            }
            showToast(message, "error");
        },
    });
};
