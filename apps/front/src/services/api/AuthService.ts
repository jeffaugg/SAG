import { API_ENDPOINTS } from "../../api/endpoints";
import {
    type AuthResponse,
    type LoginFormData,
    type RegisterFormData,
    type User,
    authResponseSchema,
    userSchema,
} from "../../modules/auth/schemas/auth.schemas";
import { BaseApiService } from "./BaseApiService";

export interface IAuthService {
    login(credentials: LoginFormData): Promise<AuthResponse>;
    register(userData: RegisterFormData): Promise<AuthResponse>;
    getCurrentUser(): Promise<User>;
    logout(): void;
}
export class AuthService extends BaseApiService implements IAuthService {
    async login(credentials: LoginFormData): Promise<AuthResponse> {
        const response = await this.post<AuthResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials,
        );
        return authResponseSchema.parse(response);
    }

    async register(userData: RegisterFormData): Promise<AuthResponse> {
        const response = await this.post<AuthResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            userData,
        );
        return authResponseSchema.parse(response);
    }

    async getCurrentUser(): Promise<User> {
        const response = await this.get<User>(API_ENDPOINTS.USUARIOS.ME);
        return userSchema.parse(response);
    }

    logout(): void {
        localStorage.removeItem("access_token");
    }
}

export const authService = new AuthService();
