import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "./endpoints";

export interface Mensagem {
    _id: string;
    conteudo: {
        texto: string;
        imagemUrl?: string;
        arquivoUrl?: string;
    };
    remetente: string;
    remetenteNome?: string;
    gestacao: string;
    tipo: string;
    createdAt: string;
    updatedAt: string;
}

export interface MensagensPaginatedResponse {
    data: Mensagem[];
    meta: {
        currentPage: number;
        itemCount: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
    };
}

export const mensagensService = {
    getByGestacao: async (
        gestacaoId: string,
        page: number = 1,
        limit: number = 20,
    ): Promise<MensagensPaginatedResponse> => {
        const response = await axiosInstance.get(
            API_ENDPOINTS.MENSAGENS.BY_GESTACAO(gestacaoId),
            {
                params: { page, limit },
            },
        );

        return response.data;
    },
};
