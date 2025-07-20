import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Paciente, PacienteFormData, PacientePaginatedResponse, PacienteSearchParams } from "../types";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import ToastService from "../../../utils/toast-service";
import { handleError } from "../../../utils/error-handler";

export const usePaciente = (params?:  PacienteSearchParams) => {

    return useQuery({
        queryKey: ["paciente", params],
        queryFn: async (): Promise<PacientePaginatedResponse> => {
            const searchParams = new URLSearchParams();

            if (params?.page && params.page > 0) {
                searchParams.append("page", params.page.toString());
            }
            if (params?.limit && params.limit > 0) {
                searchParams.append("limit", params.limit.toString());
            }

            const url = `${API_ENDPOINTS.PACIENTES.ROOT}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

            try {
                const response = await axiosInstance.get(url);
                return response.data as PacientePaginatedResponse;
            } catch (error) {
                const appError = handleError(error);
                throw new Error(`Erro ao carregar lista de pacientes: ${appError.message}`);
            }
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
    })
}

export const usePacienteById = (id: string) => {
    return useQuery({
        queryKey: ["paciente", id],
        queryFn: async (): Promise<Paciente> => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.PACIENTES.BY_ID(id));
                return response.data;
            } catch (error) {
                throw new Error(`Erro ao carregar paciente: ${error}`);
            }
        },
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
}


export const useCreatePaciente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PacienteFormData): Promise<Paciente> => {
            const response = await axiosInstance.post(
                API_ENDPOINTS.PACIENTES.ROOT, data
            )
            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paciente"] });
            ToastService.success("Paciente criado com sucesso!");
        },
        onError: (error: Error) => {
            const appError = handleError(error);
            ToastService.error(appError.message);
        }
    })
}


export const useUpdatePaciente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: PacienteFormData }): Promise<Paciente> => {
            const response = await axiosInstance.put(
                API_ENDPOINTS.PACIENTES.BY_ID(id), data
            );
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["paciente"] });
            queryClient.invalidateQueries({ queryKey: ["paciente", id] });
            ToastService.success("Paciente atualizado com sucesso!");
        },
        onError: (error: Error) => {
            const appError = handleError(error);
            ToastService.error(appError.message);
        }
    });
}


export const useDeletePaciente = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosInstance.delete(API_ENDPOINTS.PACIENTES.BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paciente"] });
            ToastService.success("Paciente excluído com sucesso!");
        },
        onError: (error: Error) => {
            const appError = handleError(error);
            ToastService.error(appError.message);
        }
    });
}