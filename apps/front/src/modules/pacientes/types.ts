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

export interface Gestacao {
    id: string;
    inicio: string;
    fim?: string | null;
    status: string;
    pacienteId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}


export interface ConsultasSearchParams {
    gestacaoId: string;
    page?: number;
    limit?: number;
    search?: string;
}



export interface Unidade {
    id: string;
    contato: string;
    nome: string;
    localizacao: string;
    cnes: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface Medico {
    id: string;
    nome: string;
    cargo: string;
    cpf: string;
    senha: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface Consulta {
    id: string;
    unidadeId: string;
    unidadeType: string;
    medicoId: string;
    gestacaoId: string;
    descricao: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    medico: Medico;
    gestacao: Gestacao;
    unidade: Unidade;
}

export interface ConsultasPaginatedResponse {
    data: Consulta[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}