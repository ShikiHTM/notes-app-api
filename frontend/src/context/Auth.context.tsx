import React, { createContext, useEffect, useState, type ReactNode } from "react"
import type { IUser, IAuthTypes } from "../types"
import api from "../api/Axios";

export const AuthContext = createContext<IAuthTypes | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async() => {
            await new Promise((res) => setTimeout(res, 2000));
            if (token) {
                try {
                    const response = await api.get('/me');

                    const authData: IUser = response.data;

                    setUser(authData);
                } catch(error) {
                    logout();
                }
            }
            setIsInitialLoading(false);
        };
        fetchUser();
    }, [token])

    const login = (token: string, userData: IUser) => {
        localStorage.setItem('access_token', token);

        setToken(token);
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(undefined);
    }

    const value: IAuthTypes = {
        user,
        token,
        isAuthenticated: !!token,
        isInitialLoading,
        login,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

