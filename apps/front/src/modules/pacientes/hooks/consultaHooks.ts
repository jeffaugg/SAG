import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { Paciente, PacienteFormData, PacientePaginatedResponse, PacienteSearchParams } from "../types";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import ToastService from "../../../utils/toast-service";
import type { Consulta } from "../types";


type ICreateAtendimentoProp = {
    gestacaoId: string;
    descricao: string;
    file?: File[] | undefined;
} | FormData;

export const useCreateAtendimento = () => {
    const queryClient = useQueryClient()

    return useMutation({

        mutationFn: async (data: ICreateAtendimentoProp): Promise<Consulta> => {
            const isFormData = data instanceof FormData;
            const response = await axiosInstance.post(
                API_ENDPOINTS.ATENDIMENTOS.ROOT,
                data,
                {
                    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
                }
            );
            return response.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["atendimento"] });
            ToastService.success("Atendimento criado com sucesso!");
        },

        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(appError.message);
        }
    })

}

export const useDeleteAtendimento = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await axiosInstance.delete(API_ENDPOINTS.ATENDIMENTOS.BY_ID(id));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["atendimento"] });
            ToastService.success("Atendimento excluído com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(appError.message);
        }
    });
};