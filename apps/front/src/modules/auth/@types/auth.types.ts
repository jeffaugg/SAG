export interface LoginCredentials {
    cpf: string;
    senha: string;
}

export interface RegisterData {
    nome: string;
    cargo: "Enfermeiro" | "Medico" | "ADM";
    cpf: string;
    senha: string;
}

export interface AuthResponse {
    token: string;
}

export interface User {
    id: string;
    name: string;
    cargo: "Enfermeiro" | "Medico" | "ADM";
    cpf: string;
    createdAt: string;
    updatedAt: string;
}
