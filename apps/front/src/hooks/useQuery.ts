import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * Cria um QueryClient com manipuladores globais de erro
 * para tanto queries (useQuery) quanto mutations (useMutation).
 */
export const createQueryClient = (
  navigate: (path: string) => void
): QueryClient => {
  const queryCache = new QueryCache({
    onError: (error) => {
      if (isOfflineError(error)) {
        navigate("/maintenance");
      }
    },
  });

  const mutationCache = new MutationCache({
    onError: (error) => {
      if (isOfflineError(error)) {
        navigate("/maintenance");
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

  // queryCache.subscribe((event: QueryCacheNotifyEvent) => {
  //   console.info("QueryCache event:", event);
  // });

  // mutationCache.subscribe((event: MutationCacheNotifyEvent) => {
  //   console.info("MutationCache event:", event);
  // });

  return queryClient;
};

/**
 * Verifica se o erro é relacionado a problemas de conexão ou backend offline.
 * @param error - O erro retornado pela query ou mutation.
 * @returns `true` se o erro for de rede/offline; caso contrário, `false`.
 */
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
