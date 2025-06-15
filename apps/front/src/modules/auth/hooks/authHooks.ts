import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosConfig";

import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import {
    authResponseSchema,
    loginSchema,
    registerSchema,
    type AuthResponse,
    type LoginFormData,
    type RegisterFormData,
    type User,
} from "../schemas/auth.schemas";

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, LoginFormData>({
        mutationFn: async (credentials) => {
            try {
                loginSchema.parse(credentials);

                const response = await axiosInstance.post<AuthResponse>(
                    API_ENDPOINTS.AUTH.LOGIN,
                    credentials,
                );

                return authResponseSchema.parse(response.data);
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: (data) => {
            localStorage.setItem("access_token", data.token);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            queryClient.invalidateQueries({ queryKey: ["authStatus"] }); // Atualizando o status de autenticação
            ToastService.success("Login realizado com sucesso!");
        },
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<AuthResponse, Error, RegisterFormData>({
        mutationFn: async (userData) => {
            try {
                registerSchema.parse(userData);

                const response = await axiosInstance.post<AuthResponse>(
                    API_ENDPOINTS.AUTH.REGISTER,
                    userData,
                );

                return authResponseSchema.parse(response.data);
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        onSuccess: (data) => {
            localStorage.setItem("access_token", data.token);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            ToastService.success("Cadastro realizado com sucesso!");
            navigate("/");
        },
    });
};

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem("access_token");

        queryClient.clear();

        ToastService.info("Você saiu do sistema");

        setTimeout(() => {
            navigate("/auth/login", { replace: true });
        }, 100);
    };
};

export const useAuthStatus = () => {
    return useQuery({
        queryKey: ["authStatus"],
        queryFn: async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                return { isAuthenticated: false };
            }

            try {
                const response = await axiosInstance.get(
                    API_ENDPOINTS.USUARIOS.ME,
                );
                return { isAuthenticated: !!response.data };
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    (error.response?.status === 401 ||
                        error.response?.status === 403)
                ) {
                    localStorage.removeItem("access_token");
                    return { isAuthenticated: false };
                }
                return { isAuthenticated: false };
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};

export const useCurrentUser = () => {
    return useQuery<User>({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    throw new Error("User not authenticated");
                }

                const response = await axiosInstance.get(
                    API_ENDPOINTS.USUARIOS.ME,
                );

                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(appError.message);
            }
        },
        enabled: !!localStorage.getItem("access_token"),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
};
