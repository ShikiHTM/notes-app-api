import { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";

const DEFAULT_DEV_URL = "ws://localhost:1234";

function resolveYjsUrl(): string {
    const fromEnv = import.meta.env.VITE_YJS_URL;
    if (fromEnv) return fromEnv;
    if (import.meta.env.DEV) return DEFAULT_DEV_URL;
    // Production fallback: derive from current origin (same host, /yjs path).
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}/yjs`;
}

export interface CollabHandle {
    ydoc: Y.Doc;
    provider: HocuspocusProvider;
    status: WebSocketStatus;
    isSynced: boolean;
}

export function useNoteCollab(
    noteId: number | null,
    token: string | null,
): CollabHandle | null {
    const [handle, setHandle] = useState<CollabHandle | null>(null);

    useEffect(() => {
        if (!noteId || !token) {
            setHandle(null);
            return;
        }

        const ydoc = new Y.Doc();
        const provider = new HocuspocusProvider({
            url: resolveYjsUrl(),
            name: `note-${noteId}`,
            document: ydoc,
            token,
        });

        const update = (patch: Partial<CollabHandle>) => {
            setHandle((prev) => {
                const base: CollabHandle = prev ?? {
                    ydoc,
                    provider,
                    status: WebSocketStatus.Connecting,
                    isSynced: false,
                };
                return { ...base, ...patch };
            });
        };

        setHandle({
            ydoc,
            provider,
            status: WebSocketStatus.Connecting,
            isSynced: false,
        });

        const onStatus = ({ status }: { status: WebSocketStatus }) =>
            update({ status });
        const onSynced = () => update({ isSynced: true });
        const onAuthFailure = () => {
            console.warn(`Collaboration auth failed for note-${noteId}`);
        };

        provider.on("status", onStatus);
        provider.on("synced", onSynced);
        provider.on("authenticationFailed", onAuthFailure);

        return () => {
            provider.off("status", onStatus);
            provider.off("synced", onSynced);
            provider.off("authenticationFailed", onAuthFailure);
            provider.destroy();
            ydoc.destroy();
            setHandle(null);
        };
    }, [noteId, token]);

    return handle;
}
