import { Outlet } from "react-router-dom";
import Sidebar from "./components/ui/Sidebar.ui";
import Navbar from "./components/ui/Navbar.ui";

export default function Layout() {
    return(
        <div className="flex w-full min-h-screen bg-slate-50 dark:bg-gh-canvas dark:text-gh-fg">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
