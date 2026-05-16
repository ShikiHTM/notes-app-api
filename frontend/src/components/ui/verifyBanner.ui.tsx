import React, { useState } from "react";
import { PiWarningFill } from "react-icons/pi";
import { useAuth } from "../../hooks/Auth.hook";
import { useSendVerificationEmail } from "../../hooks/SendVerificationEmail.hook";

const VerifyBanner: React.FC = () => {
    const { user } = useAuth();
    const [sent, setSent] = useState(false);
    const { mutate: sendEmail, isPending } = useSendVerificationEmail();

    const handleSend = () => {
        sendEmail(undefined, {
            onSuccess: () => setSent(true),
        });
    };

    if (user?.email_verified_at) return null;

    return (
        <div className="w-full min-h-10 flex justify-center items-center bg-amber-400 text-white dark:bg-gh-attention">
            <div className="flex gap-2">
                <PiWarningFill size={24} />
                {sent ? (
                    <p className="font-medium">
                        An email has been sent to <strong>{user?.email}</strong>. Please check your inbox.
                    </p>
                ) : (
                    <p className="font-medium">
                        Please verify your email address{" "}
                        <button
                            className="text-blue-600 font-medium hover:text-blue-900 bg-transparent underline cursor-pointer disabled:opacity-60"
                            onClick={handleSend}
                            disabled={isPending}
                        >
                            here
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyBanner;
