import { useCallback } from "react";
import { type ToastOptions } from "react-toastify";
import { ToastService } from "../utils/toast-service";

export const useToast = () => {
    const success = useCallback((message: string, options?: ToastOptions) => {
        return ToastService.success(message, options);
    }, []);

    const error = useCallback(
        (message: string | Error, options?: ToastOptions) => {
            return ToastService.error(message, options);
        },
        [],
    );

    const warning = useCallback((message: string, options?: ToastOptions) => {
        return ToastService.warning(message, options);
    }, []);

    const info = useCallback((message: string, options?: ToastOptions) => {
        return ToastService.info(message, options);
    }, []);

    const default_ = useCallback((message: string, options?: ToastOptions) => {
        return ToastService.default(message, options);
    }, []);

    const clearAll = useCallback(() => {
        return ToastService.clearAll();
    }, []);

    return {
        success,
        error,
        warning,
        info,
        default: default_,
        clearAll,
    };
};

export default useToast;
