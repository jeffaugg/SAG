export interface Paciente {
    id: string;
    nome: string;
    cpf: string;
    telefone: string;
    endereco: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface PacienteFormData {
    nome: string;
    cpf: string;
    telefone: string;
    endereco: string;
}

export interface PacienteSearchParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface PacientePaginatedResponse {
    data: Paciente[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}