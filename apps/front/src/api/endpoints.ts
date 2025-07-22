export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
    },
    USUARIOS: {
        ROOT: "/usuarios",
        BY_ID: (id: string) => `/usuarios/${id}`,
        ME: "/usuarios/me",
        GET_ORGANIZATIONS_BY_CPF: (cpf: string) =>
            `/usuarios/${cpf}/organizacao`,
    },
    GESTACOES: {
        ROOT: "/gestacoes",
        BY_ID: (id: string) => `/gestacoes/${id}`,
    },
    PACIENTES: {
        ROOT: "/pacientes",
        BY_ID: (id: string) => `/pacientes/${id}`,
        GESTACOES: (id: string) => `/pacientes/${id}/gestacoes`,
    },
    POLICLINICAS: {
        ROOT: "/policlinicas",
        BY_ID: (id: string) => `/policlinicas/${id}`,
        USUARIOS: (cns: string) => `/policlinicas/${cns}/usuarios`,
        ADD_USUARIO: (id: string, usuarioId: string) =>
            `/policlinicas/${id}/usuarios/${usuarioId}`,
    },
    UBS: {
        ROOT: "/ubs",
        BY_ID: (id: string) => `/ubs/${id}`,
        USUARIOS: (cnes: string) => `/ubs/${cnes}/usuarios`,
        ADD_USUARIO: (id: string, usuarioId: string) =>
            `/ubs/${id}/usuarios/${usuarioId}`,
    },
};
