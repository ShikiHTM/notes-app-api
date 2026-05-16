import { Outlet, useMatch } from "react-router-dom";
import Sidebar from "./components/ui/Sidebar.ui";
import Navbar from "./components/ui/Navbar.ui";
import VerifyBanner from "./components/ui/verifyBanner.ui";

export default function Layout() {
    const isInEditor = useMatch("/notes/:id") != null;

    return (
        <div className="flex flex-col w-full h-screen bg-slate-50 dark:bg-gh-canvas dark:text-gh-fg">
            <VerifyBanner />
            <div className="flex flex-1 min-h-0">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 min-h-0">
                    {!isInEditor && <Navbar />}
                    <main className="flex-1 overflow-y-auto p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
