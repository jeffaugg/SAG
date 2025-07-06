export interface Usuario {
    id: string;
    nome: string;
    cargo: "Enfermeiro" | "Medico" | "ADM";
    cpf: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface UsuarioFormData {
    nome: string;
    cargo: "Enfermeiro" | "Medico" | "ADM";
    cpf: string;
    senha?: string;
}

export interface UsuarioSearchParams {
    page?: number;
    limit?: number;
    search?: string;
    cargo?: "Enfermeiro" | "Medico" | "ADM";
}

export interface UsuarioPaginatedResponse {
    data: Usuario[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}
