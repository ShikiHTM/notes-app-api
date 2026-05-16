declare global {
    interface Window {
        __CONFIG__?: {
            API_URL?: string;
            YJS_URL?: string;
        };
    }
}

export {};
