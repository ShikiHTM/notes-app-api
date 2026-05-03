import type { IUser } from "./user.types";

export interface ILoginRequest {
    email: string;
    password: string;
};

export interface ILoginCardProps {
    onLogin: (data: ILoginRequest) => Promise<void>;
    isLoading: boolean;
    errorMessage?: string | null;
}

export interface IRegisterCardProps {
    onRegister: (data: IRegisterRequest) => Promise<void>;
    isLoading: boolean;
    errorMessage?: string | null;
}

export interface IRegisterRequest {
    display_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface ILoginResponse {
    token: string;
    token_type: string;
}

export interface IRegisterResponse {
    token: string;
    token_type: string;
    user: IUser;
}