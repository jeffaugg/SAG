import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const createQueryClient = (
    navigate?: (path: string) => void,
): QueryClient => {
    const queryCache = new QueryCache({
        onError: (error) => {
            if (isOfflineError(error)) {
                if (navigate) {
                    navigate("/maintenance");
                } else {
                    window.location.href = "/maintenance";
                }
            }
        },
    });

    const mutationCache = new MutationCache({
        onError: (error) => {
            if (isOfflineError(error)) {
                if (navigate) {
                    navigate("/maintenance");
                } else {
                    window.location.href = "/maintenance";
                }
            }
        },
    });

    const queryClient = new QueryClient({
        queryCache,
        mutationCache,
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return queryClient;
};

function isOfflineError(error: unknown): boolean {
    if (!navigator.onLine) {
        return true;
    }

    const offlineErrorCodes = ["ECONNABORTED", "ECONNREFUSED", "ERR_NETWORK"];
    const offlineErrorMessages = ["Network Error"];
    const offlineStatusCodes = [503, 0];

    const isAxiosError = axios.isAxiosError(error);
    const hasNoResponse = isAxiosError && !error.response;
    const hasOfflineErrorCode =
        isAxiosError && error.code && offlineErrorCodes.includes(error.code);
    const hasOfflineErrorMessage =
        isAxiosError &&
        error.message &&
        offlineErrorMessages.includes(error.message);
    const hasOfflineStatusCode =
        isAxiosError &&
        error.response?.status !== undefined &&
        offlineStatusCodes.includes(error.response.status);

    const isNetworkError =
        hasNoResponse ||
        hasOfflineErrorCode ||
        hasOfflineErrorMessage ||
        hasOfflineStatusCode;

    return isNetworkError;
}
