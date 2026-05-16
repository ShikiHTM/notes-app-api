import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "../api/Axios";
import useToast from "./Toast.hook";

export const useSendVerificationEmail = () => {
    const { showToast } = useToast();

    return useMutation({
        mutationFn: async () => {
            const response = await api.post("/auth/email/verification-notification");
            return response.data;
        },
        onSuccess: () => {
            showToast("Verification email sent!", "success");
        },
        onError: (error) => {
            let message = "Failed to send verification email";
            if (error instanceof AxiosError && error.response?.data?.message) {
                message = error.response.data.message;
            }
            showToast(message, "error");
        },
    });
};
