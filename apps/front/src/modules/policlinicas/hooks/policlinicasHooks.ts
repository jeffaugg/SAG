import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import { ToastService } from "../../../utils/toast-service";
import type {
    Policlinica,
    PoliclinicaFormData,
    PoliclinicaPaginatedResponse,
    PoliclinicaSearchParams,
} from "../types";

export const usePoliclinicas = (params?: PoliclinicaSearchParams) => {
    return useQuery({
        queryKey: ["policlinicas", params],
        queryFn: async (): Promise<PoliclinicaPaginatedResponse> => {
            const searchParams = new URLSearchParams();

            if (params?.page && params.page > 0) {
                searchParams.append("page", params.page.toString());
            }
            if (params?.limit && params.limit > 0) {
                searchParams.append("limit", params.limit.toString());
            }
            if (params?.search?.trim()) {
                searchParams.append("search", params.search.trim());
            }

            const url = `${API_ENDPOINTS.POLICLINICAS.ROOT}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

            try {
                const response = await axiosInstance.get(url);
                return response.data as PoliclinicaPaginatedResponse;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(
                    `Erro ao carregar lista de policlínicas: ${appError.message}`,
                );
            }
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const usePoliclinicaById = (id: string) => {
    return useQuery({
        queryKey: ["policlinicas", id],
        queryFn: async (): Promise<Policlinica> => {
            try {
                const response = await axiosInstance.get(
                    API_ENDPOINTS.POLICLINICAS.BY_ID(id),
                );
                return response.data;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(
                    `Erro ao carregar policlínica: ${appError.message}`,
                );
            }
        },
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreatePoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PoliclinicaFormData): Promise<Policlinica> => {
            const response = await axiosInstance.post(
                API_ENDPOINTS.POLICLINICAS.ROOT,
                data,
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["policlinicas"] });
            ToastService.success("Policlínica criada com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao criar policlínica: ${appError.message}`,
            );
        },
    });
};

export const useUpdatePoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<PoliclinicaFormData>;
        }): Promise<Policlinica> => {
            const response = await axiosInstance.put(
                API_ENDPOINTS.POLICLINICAS.BY_ID(id),
                data,
            );
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["policlinicas"] });
            queryClient.invalidateQueries({ queryKey: ["policlinicas", id] });
            ToastService.success("Policlínica atualizada com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao atualizar policlínica: ${appError.message}`,
            );
        },
    });
};

export const useDeletePoliclinica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosInstance.delete(API_ENDPOINTS.POLICLINICAS.BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["policlinicas"] });
            ToastService.success("Policlínica excluída com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(
                `Erro ao excluir policlínica: ${appError.message}`,
            );
        },
    });
};
