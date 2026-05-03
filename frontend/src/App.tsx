import { BrowserRouter, useRoutes } from "react-router-dom"
import { authRoutes } from "./pages/auth/auth.routes"
import { ToastProvider } from "./core/toast/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppRoutes } from "./routes";

function AppContent() {
    const element = useRoutes([
        ...authRoutes,
        {
            path: '/',
            element: <ProtectedRoute />,
            children: [
                ...AppRoutes
            ]
        },
        {
            path: '*',
            element: <div className="flex items-center justify-center h-screen">404 - Not Found</div>
        }
    ])

    return element;
}

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    )
}

export default App
