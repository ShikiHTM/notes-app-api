import { BrowserRouter, useRoutes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authRoutes } from "./pages/auth/auth.routes";
import { ToastProvider } from "./core/toast/ToastContext";
import { AuthProvider } from "./context/Auth.context";
import { ProtectedRoute } from "./routes/Protected.route";
import { AppRoutes } from "./routes/index.route";
import { ModalProvider } from "./context/Modal.context";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function AppContent() {
    const element = useRoutes([
        ...authRoutes,
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [...AppRoutes],
        },
        {
            path: "*",
            element: (
                <div className="flex items-center justify-center h-screen">
                    404 - Not Found
                </div>
            ),
        },
    ]);

    return element;
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <AppContent />
                        </BrowserRouter>
                    </ModalProvider>
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
