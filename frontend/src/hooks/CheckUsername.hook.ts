import { useEffect, useState } from "react";
import api from "../api/Axios";

export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "error";

export const useCheckUsername = (username: string, debounceMs = 400) => {
    const [status, setStatus] = useState<UsernameStatus>("idle");

    useEffect(() => {
        const trimmed = username.trim();
        if (trimmed.length < 3) {
            setStatus("idle");
            return;
        }

        setStatus("checking");
        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                const res = await api.post(
                    "/auth/check-username",
                    { username: trimmed },
                    { signal: controller.signal },
                );
                setStatus(res.data?.available ? "available" : "taken");
            } catch (err: unknown) {
                if (controller.signal.aborted) return;
                setStatus("error");
            }
        }, debounceMs);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [username, debounceMs]);

    return status;
};
