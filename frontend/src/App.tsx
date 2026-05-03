import { BrowserRouter, useRoutes } from "react-router-dom"
import { authRoutes } from "./pages/auth/auth.routes"
import { ToastProvider } from "./core/toast/toastContext";

function AppContent() {
    const element = useRoutes([
        ...authRoutes,
        {
            path: '*',
            element: <div className="flex items-center justify-center h-screen">404 - Not Found</div>
        }
    ])

    return element;
}

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </ToastProvider>
    )
}

export default App
