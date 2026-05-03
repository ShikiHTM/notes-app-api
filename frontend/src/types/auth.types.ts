import type { IUser } from "./user.types";

export interface ILoginRequest {
    email: string;
    password: string;
};

interface IOmniCardProps {
    isLoading: boolean;
    errorMessage?: string | null;
}

export interface ILoginCardProps extends IOmniCardProps {
    onLogin: (data: ILoginRequest) => Promise<void>;
}

export interface IRegisterCardProps extends IOmniCardProps {
    onRegister: (data: IRegisterRequest) => Promise<void>;
}

export interface IRegisterRequest extends ILoginRequest {
    display_name: string;
    confirm_password: string;
}

export interface IAuthResponse {
    token: string;
    toke_type: string;
    user: IUser;
}

export type IAuthTypes = {
    user?: IUser;
    token: string | null;
    isAuthenticated: boolean;
    isInitialLoading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
}
