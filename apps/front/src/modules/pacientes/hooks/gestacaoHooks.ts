
/* eslint-disable @typescript-eslint/no-explicit-any */
// Hooks customizados para manipulação de gestações e consultas usando React Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import ToastService from "../../../utils/toast-service";
import type { ConsultasPaginatedResponse, ConsultasSearchParams, Gestacao, GestacaoCreateFormData } from "../types";

/**
 * Hook para buscar todas as gestações de um paciente pelo ID.
 * Usa React Query para cache e atualização automática.
 * @param id ID do paciente
 * @returns Lista de gestações e estados de loading/erro
 */
export const useGestacaoByPacienteID = (id: string) => {
    console.log("useGestacaoByPacienteID", id);
    return useQuery<Gestacao[]>({
        queryKey: ["gestacao", id],
        queryFn: async (): Promise<Gestacao[]> => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.PACIENTES.GESTACOES(id));
                return response.data;
            } catch (error) {
                throw new Error(`Erro ao carregar gestação: ${error}`);
            }
        },
        enabled: !!id,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook para buscar consultas de uma gestação específica, com paginação.
 * @param gestacaoId ID da gestação
 * @param params Parâmetros de busca (página, limite, etc)
 * @returns Lista paginada de consultas e estados de loading/erro
 */
export const useConsultasByGestacaoID = ({ gestacaoId, ...params }: ConsultasSearchParams) => {
    return useQuery({
        queryKey: ["atendimento", gestacaoId, params],
        queryFn: async (): Promise<ConsultasPaginatedResponse> => {
            const searchParams = new URLSearchParams();

            if (params?.page && params.page > 0) {
                searchParams.append("page", params.page.toString());
            }
            if (params?.limit && params.limit > 0) {
                searchParams.append("limit", params.limit.toString());
            }
            // Monta a URL com os parâmetros de busca
            const url = `${API_ENDPOINTS.ATENDIMENTOS.GESTACAO(gestacaoId)}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
            try {
                const response = await axiosInstance.get(url);
                return response.data as ConsultasPaginatedResponse;
            } catch (error) {
                throw new Error(`Erro ao carregar consultas: ${error}`);
            }
        },
        enabled: !!gestacaoId,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
}


/**
 * Hook para criar uma nova gestação.
 * Usa React Query para mutação e atualização automática do cache.
 * @returns Função de mutação, estados de loading/erro e callbacks de sucesso/erro
 */
export const useCreateGestacao = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["gestacao"],
        mutationFn: async (data: GestacaoCreateFormData): Promise<Gestacao> => {
            // Converte datas para formato ISO antes de enviar para a API
            const { inicio: dataInicio, fim: dataTermino, ...rest } = data;

            const dataInicioISO = new Date(dataInicio).toISOString();
            const dataTerminoISO = dataTermino ? new Date(dataTermino).toISOString() : undefined;

            const payload: any = {
                ...rest,
                inicio: dataInicioISO,
            };
            
            if (dataTermino) payload.fim = dataTerminoISO;
            

            try {
                const response = await axiosInstance.post(API_ENDPOINTS.GESTACOES.ROOT, payload);
                return response.data;
            } catch (error) {
                throw new Error(`Erro ao criar gestação: ${error}`);
            }
    },

        onSuccess: () => {
            // Atualiza o cache das gestações após criar
            queryClient.invalidateQueries({ queryKey: ["gestacao"] });
            ToastService.success("Gestação criada com sucesso!");
            
        },
        onError: (error) => {
            // Trata e exibe erro amigável
            const appError = handleError(error);
            ToastService.error(`Erro ao criar gestação: ${appError.message}`);
        }
    });
};


/**
 * Hook para excluir uma gestação pelo ID.
 * Usa React Query para mutação e atualização automática do cache.
 * @returns Função de mutação, estados de loading/erro e callbacks de sucesso/erro
 */
export const useDeleteGestacao = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["gestacao", "delete"],
        mutationFn: async (id: string): Promise<void> => {
            try {
                await axiosInstance.delete(API_ENDPOINTS.GESTACOES.BY_ID(id));
            } catch (error) {
                throw new Error(`Erro ao excluir gestação: ${error}`);
            }
        },
        onSuccess: () => {
            // Atualiza o cache das gestações após exclusão
            queryClient.invalidateQueries({ queryKey: ["gestacao"] });
            ToastService.success("Gestação excluída com sucesso!");
        },
        onError: (error) => {
            // Trata e exibe erro amigável
            const appError = handleError(error);
            ToastService.error(`Erro ao excluir gestação: ${appError.message}`);
        }
    });
}
