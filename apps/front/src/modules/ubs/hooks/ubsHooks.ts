import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import type {
    UBS,
    UBSFormData,
    UBSPaginatedResponse,
    UBSSearchParams,
} from "../types";

export const useUBS = (params?: UBSSearchParams) => {
    return useQuery({
        queryKey: ["ubs", params],
        queryFn: async (): Promise<UBSPaginatedResponse> => {
            const searchParams = new URLSearchParams();

            if (params?.page && params.page > 0) {
                searchParams.append("page", params.page.toString());
            }
            if (params?.limit && params.limit > 0) {
                searchParams.append("limit", params.limit.toString());
            }
            if (params?.search?.trim()) {
                searchParams.append("filter", params.search.trim());
            }

            const url = `${API_ENDPOINTS.UBS.ROOT}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

            try {
                const response = await axiosInstance.get(url);
                return response.data as UBSPaginatedResponse;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(
                    `Erro ao carregar lista de UBS: ${appError.message}`,
                );
            }
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUBSById = (id: string) => {
    return useQuery({
        queryKey: ["ubs", id],
        queryFn: async (): Promise<UBS> => {
            try {
                const response = await axiosInstance.get(
                    API_ENDPOINTS.UBS.BY_ID(id),
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(`Erro ao carregar UBS: ${appError.message}`);
            }
        },
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateUBS = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UBSFormData): Promise<UBS> => {
            const response = await axiosInstance.post(
                API_ENDPOINTS.UBS.ROOT,
                data,
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ubs"] });
            ToastService.success("UBS criada com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao criar UBS: ${appError.message}`);
        },
    });
};

export const useUpdateUBS = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<UBSFormData>;
        }): Promise<UBS> => {
            const response = await axiosInstance.put(
                API_ENDPOINTS.UBS.BY_ID(id),
                data,
            );
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["ubs"] });
            queryClient.invalidateQueries({ queryKey: ["ubs", id] });
            ToastService.success("UBS atualizada com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao atualizar UBS: ${appError.message}`);
        },
    });
};

export const useDeleteUBS = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosInstance.delete(API_ENDPOINTS.UBS.BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ubs"] });
            ToastService.success("UBS excluída com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao excluir UBS: ${appError.message}`);
        },
    });
};
