import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const readInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyThemeClass = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
};

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(readInitialTheme);

    useEffect(() => {
        applyThemeClass(theme);
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = useCallback((next: Theme) => setThemeState(next), []);
    const toggleTheme = useCallback(
        () => setThemeState(prev => (prev === "dark" ? "light" : "dark")),
        []
    );

    return { theme, setTheme, toggleTheme };
};

export const initThemeFromStorage = () => {
    if (typeof window === "undefined") return;
    applyThemeClass(readInitialTheme());
};
