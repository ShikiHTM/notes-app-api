import useToast from "./Toast.hook";
import api from "../api/Axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const QueryName = "userProfile";

export interface IUpdateProfilePayload {
    name?: string,
    email?: string
}

export const useUpdateProfile = () => {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: IUpdateProfilePayload) => {
            const response = await api.patch("/user", payload);
            return response.data;
        },
        onSuccess: () => {
            showToast("Cập nhật thông tin thành công", "success");
            queryClient.invalidateQueries({ queryKey: [QueryName] })
        },
        onError: (error) => {
            console.error(error);
            let errorMessage = "Cập nhật thông tin thất bại";

            if (error instanceof AxiosError && error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            showToast(errorMessage, "error");
        }
    })
};
