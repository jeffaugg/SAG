import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "./@types/api.types";

const axiosInstance = axios.create({
    baseURL: process.env.VITE_API_END_POINT,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        if (axios.isAxiosError(error) && error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                localStorage.removeItem("access_token");
            }

            if (status === 400 && error.response.data?.details) {
                const apiDetails = error.response.data.details;
                const formattedError = new Error(
                    error.response.data.message || "Erro de validação",
                );
                (formattedError as any).details = apiDetails;
                (formattedError as any).statusCode = status;
                return Promise.reject(formattedError);
            }

            if (error.response.data?.message) {
                const formattedError = new Error(error.response.data.message);
                (formattedError as any).statusCode = status;
                return Promise.reject(formattedError);
            }
        }

        if (error.code === "ECONNABORTED") {
            return Promise.reject(
                new Error(
                    "Tempo limite esgotado. Verifique sua conexão com a internet.",
                ),
            );
        }

        if (!error.response) {
            return Promise.reject(
                new Error(
                    "Não foi possível conectar ao servidor. Verifique sua conexão.",
                ),
            );
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
