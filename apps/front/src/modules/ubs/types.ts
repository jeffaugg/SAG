export interface UBS {
    id: string;
    cnes: string;
    nome: string;
    localizacao: string;
    contato: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface UBSFormData {
    cnes: string;
    nome: string;
    localizacao: string;
    contato: string;
}

export interface UBSSearchParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface UBSPaginatedResponse {
    data: UBS[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
