import type React from "react";
import { useState } from "react";
import DesktopSearch from "./navbar/DesktopSearch.navbar";
import MobileSearch from "./navbar/MobileSearch.navbar";
// import ViewModeToggle from "./navbar/ViewModeToggle.navbar";

const Navbar: React.FC = () => {
    // const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <nav className="h-16 border-b border-slate-300 bg-white dark:bg-gh-canvas-subtle dark:border-gh-border flex items-center justify-between px-4 md:px-8">
            {/* Search Section */}
            <DesktopSearch />

            <MobileSearch
                isOpen={isMobileSearchOpen}
                onOpen={() => setIsMobileSearchOpen(true)}
                onClose={() => setIsMobileSearchOpen(false)}
            />

            {/* Right Side Tools */}
            <div className="flex items-center gap-6 text-slate-600 dark:text-gh-fg-muted">
                {/* <ViewModeToggle
                    viewMode={viewMode}
                    onToggle={() => setViewMode(v => v === 'card' ? 'list' : 'card')}
                /> */}
            </div>
        </nav>
    );
};

export default Navbar;