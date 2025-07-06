import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";

function isOfflineError(error: unknown): boolean {
    if (!navigator.onLine) {
        return true;
    }

    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (!status) return true;
        return status >= 500;
    }

    return false;
}

export const createQueryClient = (): QueryClient => {
    const queryCache = new QueryCache({
        onError: (error) => {
            if (isOfflineError(error)) {
                window.location.href = "/maintenance";
            }
        },
    });

    const mutationCache = new MutationCache({
        onError: (error) => {
            if (isOfflineError(error)) {
                window.location.href = "/maintenance";
            }
        },
    });

    return new QueryClient({
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
};
