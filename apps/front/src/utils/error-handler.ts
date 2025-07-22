import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import type { ApiErrorResponse } from "../api/@types/api.types";
import type { AppError } from "./@types/error.types";

export const formatZodError = (error: ZodError): Record<string, string[]> => {
    const formattedErrors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!formattedErrors[path]) {
            formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
    });

    return formattedErrors;
};

export const formatApiError = (
    error: AxiosError<ApiErrorResponse>,
): AppError => {
    if (error.response) {
        const statusCode = error.response.status;
        const data = error.response.data;

        if (statusCode === 401 || statusCode === 403) {
            return {
                message:
                    data.message ||
                    "Você não está autenticado ou não possui permissão para esta ação.",
                type: "auth",
                statusCode,
            };
        }

        return {
            message:
                data.message ||
                "Ocorreu um erro na comunicação com o servidor.",
            type: "api",
            details: data.details,
            statusCode,
        };
    }

    if (error.request) {
        return {
            message:
                "Não foi possível se comunicar com o servidor. Verifique sua conexão de internet.",
            type: "network",
        };
    }

    return {
        message: error.message || "Ocorreu um erro na aplicação.",
        type: "unknown",
    };
};

export const handleError = (error: unknown): AppError => {
    if (error instanceof ZodError) {
        return {
            message: "Erro de validação nos dados fornecidos.",
            type: "validation",
            details: formatZodError(error),
        };
    }

    if (axios.isAxiosError(error)) {
        return formatApiError(error);
    }

    if (error instanceof Error) {
        return {
            message: error.message || "Ocorreu um erro inesperado.",
            type: "unknown",
        };
    }

    return {
        message: "Ocorreu um erro inesperado.",
        type: "unknown",
    };
};

export const getErrorMessage = (error: AppError): string => {
    switch (error.type) {
        case "validation":
            return "Os dados fornecidos são inválidos. Por favor, verifique os campos e tente novamente.";
        case "api":
            if (error.statusCode === 404) {
                return "O recurso solicitado não foi encontrado.";
            }
            return error.message;
        case "network":
            return "Não foi possível se comunicar com o servidor. Verifique sua conexão de internet.";
        case "auth":
            return "Sua sessão expirou ou você não tem permissão para realizar esta ação.";
        default:
            return "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";
    }
};
