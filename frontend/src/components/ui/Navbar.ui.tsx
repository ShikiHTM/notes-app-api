import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DesktopSearch from "./navbar/DesktopSearch.navbar";
import MobileSearch from "./navbar/MobileSearch.navbar";
import ViewModeToggle from "./navbar/ViewModeToggle.navbar";

const SEARCH_DEBOUNCE_MS = 250;

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const urlQuery = params.get("q") ?? "";

    const [query, setQuery] = useState(urlQuery);
    const [lastSyncedUrlQuery, setLastSyncedUrlQuery] = useState(urlQuery);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // Sync local input when the URL changes from elsewhere (back/forward, link clicks).
    if (urlQuery !== lastSyncedUrlQuery) {
        setLastSyncedUrlQuery(urlQuery);
        setQuery(urlQuery);
    }

    // Debounce input → URL. Always lands on /notes so results show in the list view.
    useEffect(() => {
        if (query === urlQuery) return;
        const handle = setTimeout(() => {
            const trimmed = query.trim();
            const onNotes = location.pathname === "/notes";
            if (trimmed === "") {
                if (onNotes) {
                    navigate("/notes", { replace: true });
                }
                return;
            }
            navigate(`/notes?q=${encodeURIComponent(trimmed)}`, {
                replace: onNotes,
            });
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(handle);
    }, [query, urlQuery, location.pathname, navigate]);

    return (
        <nav className="h-16 border-b border-slate-300 bg-white dark:bg-gh-canvas-subtle dark:border-gh-border flex items-center justify-between px-4 md:px-8">
            <DesktopSearch value={query} onChange={setQuery} />

            <MobileSearch
                isOpen={isMobileSearchOpen}
                onOpen={() => setIsMobileSearchOpen(true)}
                onClose={() => setIsMobileSearchOpen(false)}
                value={query}
                onChange={setQuery}
            />

            <div className="flex items-center gap-6 text-slate-600 dark:text-gh-fg-muted">
                <ViewModeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
