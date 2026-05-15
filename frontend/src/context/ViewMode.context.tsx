import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type ViewMode = "grid" | "list";

export interface IViewModeContext {
    viewMode: ViewMode;
    toggleViewMode: () => void;
    setViewMode: (mode: ViewMode) => void;
}

const STORAGE_KEY = "notes:viewMode";

const readInitial = (): ViewMode => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "list" ? "list" : "grid";
};

export const ViewModeContext = createContext<IViewModeContext | undefined>(
    undefined,
);

export const ViewModeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [viewMode, setViewModeState] = useState<ViewMode>(readInitial);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, viewMode);
    }, [viewMode]);

    const setViewMode = useCallback((mode: ViewMode) => {
        setViewModeState(mode);
    }, []);

    const toggleViewMode = useCallback(() => {
        setViewModeState((m) => (m === "grid" ? "list" : "grid"));
    }, []);

    return (
        <ViewModeContext.Provider
            value={{ viewMode, toggleViewMode, setViewMode }}
        >
            {children}
        </ViewModeContext.Provider>
    );
};
