import { BrowserRouter, useRoutes } from "react-router-dom"
import { authRoutes } from "./pages/auth/auth.routes"
import { ToastProvider } from "./core/toast/ToastContext";
import { AuthProvider } from "./context/Auth.context";
import { ProtectedRoute } from "./routes/Protected.route";
import { AppRoutes } from "./routes/index.route";
import { ModalProvider } from "./context/Modal.context";

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
                <ModalProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </ModalProvider>
            </ToastProvider>
        </AuthProvider>
    )
}

export default App
