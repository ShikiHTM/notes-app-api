import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/Axios";

type VerifyState = "loading" | "success" | "error";

export default function VerifyPage() {
    const [searchParams] = useSearchParams();
    const [state, setState] = useState<VerifyState>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const id = searchParams.get("id");
        const hash = searchParams.get("hash");
        const expires = searchParams.get("expires");
        const signature = searchParams.get("signature");

        if (!id || !hash || !expires || !signature) {
            setState("error");
            setErrorMessage("Liên kết không hợp lệ.");
            return;
        }

        api.get(`/email/verify/${id}/${hash}`, { params: { expires, signature } })
            .then(() => setState("success"))
            .catch((err) => {
                setState("error");
                setErrorMessage(
                    err.response?.data?.message ?? "Liên kết đã hết hạn hoặc không hợp lệ.",
                );
            });
    }, []);

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-gh-canvas"
            style={{
                backgroundImage:
                    "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%)",
            }}
        >
            <div className="bg-white dark:bg-gh-canvas-subtle rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                {state === "loading" && (
                    <p className="text-gh-fg-muted">Đang xác thực email...</p>
                )}
                {state === "success" && (
                    <>
                        <div className="text-5xl mb-4">✅</div>
                        <h2 className="text-xl font-semibold text-gh-fg mb-2">
                            Xác thực thành công!
                        </h2>
                        <p className="text-gh-fg-muted">
                            Bạn đã xác thực email thành công. Bạn có thể đóng trang này.
                        </p>
                    </>
                )}
                {state === "error" && (
                    <>
                        <div className="text-5xl mb-4">❌</div>
                        <h2 className="text-xl font-semibold text-gh-fg mb-2">
                            Xác thực thất bại
                        </h2>
                        <p className="text-gh-fg-muted">{errorMessage}</p>
                    </>
                )}
            </div>
        </div>
    );
}
