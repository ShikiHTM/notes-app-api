import { useContext } from "react";
import { ViewModeContext } from "../context/ViewMode.context";

export const useViewMode = () => {
    const context = useContext(ViewModeContext);
    if (!context) {
        throw new Error("useViewMode must be used within a ViewModeProvider!");
    }
    return context;
};
