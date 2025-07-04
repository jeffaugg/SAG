import { toast, type ToastOptions } from "react-toastify";
import { type AppError } from "./@types/error.types";

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export const ToastService = {
    success: (message: string, options?: ToastOptions) => {
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

        return toast.error(errorMessage, {
            ...defaultOptions,
            ...options,
        });
    },

    warning: (message: string, options?: ToastOptions) => {
        return toast.warning(message, {
            ...defaultOptions,
            ...options,
        });
    },

    info: (message: string, options?: ToastOptions) => {
        return toast.info(message, {
            ...defaultOptions,
            ...options,
        });
    },

    default: (message: string, options?: ToastOptions) => {
        return toast(message, {
            ...defaultOptions,
            ...options,
        });
    },

    handleError: (error: unknown, options?: ToastOptions) => {
        if (error instanceof Error) {
            return toast.error(error.message, {
                ...defaultOptions,
                ...options,
            });
        }

        if (typeof error === "string") {
            return toast.error(error, {
                ...defaultOptions,
                ...options,
            });
        }

        return toast.error(
            "Ocorreu um erro inesperado. Por favor, tente novamente.",
            {
                ...defaultOptions,
                ...options,
            },
        );
    },

    clearAll: () => {
        toast.dismiss();
    },
};

export default ToastService;
