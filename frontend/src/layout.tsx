import { Outlet } from "react-router-dom";

export default function Layout() {
    return(
            <Sidebar />
            <Outlet />
        </div>
    );
}