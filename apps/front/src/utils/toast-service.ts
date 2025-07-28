import { toast, type ToastOptions } from "react-toastify";
import { type AppError } from "./useErrorHandler";

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const activeToasts = new Set<string>();

const preventDuplicate = (message: string, type: string) => {
    const key = `${type}:${message}`;
    if (activeToasts.has(key)) {
        return null;
    }
    activeToasts.add(key);
    setTimeout(() => activeToasts.delete(key), 100);
    return key;
};

export const ToastService = {
    success: (message: string, options?: ToastOptions) => {
        if (!preventDuplicate(message, "success")) return;
        return toast.success(message, {
            ...defaultOptions,
            ...options,
        });
    },

    error: (message: string | Error | AppError, options?: ToastOptions) => {
        const errorMessage =
            typeof message === "string"
                ? message
                : message instanceof Error
                  ? message.message
                  : "Um erro ocorreu";

        if (!preventDuplicate(errorMessage, "error")) return;
        return toast.error(errorMessage, {
            ...defaultOptions,
            ...options,
        });
    },

    warning: (message: string, options?: ToastOptions) => {
        if (!preventDuplicate(message, "warning")) return;
        return toast.warning(message, {
            ...defaultOptions,
            ...options,
        });
    },

    info: (message: string, options?: ToastOptions) => {
        if (!preventDuplicate(message, "info")) return;
        return toast.info(message, {
            ...defaultOptions,
            ...options,
        });
    },

    default: (message: string, options?: ToastOptions) => {
        if (!preventDuplicate(message, "default")) return;
        return toast(message, {
            ...defaultOptions,
            ...options,
        });
    },

    handleError: (error: unknown, options?: ToastOptions) => {
        let errorMessage: string;

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === "string") {
            errorMessage = error;
        } else {
            errorMessage =
                "Ocorreu um erro inesperado. Por favor, tente novamente.";
        }

        if (!preventDuplicate(errorMessage, "error")) return;
        return toast.error(errorMessage, {
            ...defaultOptions,
            ...options,
        });
    },

    clearAll: () => {
        toast.dismiss();
    },
};

export default ToastService;
