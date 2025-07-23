import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../api/endpoints";
import type { ConsultasPaginatedResponse, ConsultasSearchParams, Gestacao } from "../types";
import axiosInstance from "../../../api/axiosConfig";


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
        queryKey: ["consulta", gestacaoId],
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
