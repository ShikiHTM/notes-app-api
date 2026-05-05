import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth.hook"
import { PuffLoader } from "react-spinners";

export const ProtectedRoute = () => {
    const { isAuthenticated, isInitialLoading } = useAuth();

    if(isInitialLoading) {
        return (
            <div className="w-full min-h-screen flex flex-col justify-center items-center">
                <PuffLoader
                    color="#4f39f6"
                    loading
                    size={100}
                />
            </div>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
}
