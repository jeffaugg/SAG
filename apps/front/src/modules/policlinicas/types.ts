export interface Policlinica {
    id: string;
    cnes: string;
    nome: string;
    localizacao: string;
    contato: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface PoliclinicaFormData {
    cnes: string;
    nome: string;
    localizacao: string;
    contato: string;
}

export interface PoliclinicaSearchParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PoliclinicaPaginatedResponse {
    data: Policlinica[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
