/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosConfig";
import { API_ENDPOINTS } from "../../../api/endpoints";
import { handleError } from "../../../utils/error-handler";
import ToastService from "../../../utils/toast-service";
import type { ConsultasPaginatedResponse, ConsultasSearchParams, Gestacao, GestacaoCreateFormData } from "../types";


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

export const useCreateGestacao = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["gestacao"],
        mutationFn: async (data: GestacaoCreateFormData): Promise<Gestacao> => {
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
            queryClient.invalidateQueries({ queryKey: ["gestacao"] });
            ToastService.success("Gestação criada com sucesso!");
            
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao criar gestação: ${appError.message}`);
        }
    });
};

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
            queryClient.invalidateQueries({ queryKey: ["gestacao"] });
            ToastService.success("Gestação excluída com sucesso!");
        },
        onError: (error) => {
            const appError = handleError(error);
            ToastService.error(`Erro ao excluir gestação: ${appError.message}`);
        }
    });
}
