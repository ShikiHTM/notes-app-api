import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../hooks/Auth.hook";

const SettingsContent: React.FC = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.display_name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");

    const isDirty = name !== (user?.display_name ?? "") || email !== (user?.email ?? "");

    return (
        <div className="flex gap-6 items-start">
            <button
                type="button"
                className="relative group w-28 h-28 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer"
            >
                <span className="text-3xl font-semibold text-slate-500">
                    {(user?.display_name ?? "?").charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <MdEdit size={28} className="text-white" />
                </div>
            </button>

            <div className="flex-1 flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span className="text-sm text-slate-600">Tên tài khoản</span>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm text-slate-600">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </label>

                <button
                    disabled={!isDirty}
                    onClick={() => {}}
                    className="self-start px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-400 transition cursor-pointer hover:bg-indigo-700"
                >
                    Lưu
                </button>
            </div>
        </div>
    )
}

export default SettingsContent;
