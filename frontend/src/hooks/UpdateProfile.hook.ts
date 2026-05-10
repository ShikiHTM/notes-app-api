import { useState } from "react";
import useToast from "./Toast.hook";
import api from "../api/Axios";

export const useUpdateProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const updateProfile = async (payload: {
        name?: string;
        email?: string;
    }) => {
        setIsLoading(true);
        try {
            await api.post("/user/update", payload);
            showToast("Cập nhật thông tin thành công!", "success");
        } catch (e) {
            showToast("Cập nhật thông tin thất bại!", "error");
        } finally {
            setIsLoading(false);
        }
    };
};
