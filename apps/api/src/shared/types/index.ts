import { Paciente, Policlinica } from '@prisma/client';
import { UBS } from '@prisma/client';

export enum OrganizacaoTipo {
    POLICLINICA = 'policlinica',
    UBS = 'ubs',
}

export type OrganizacaoPorUsuario =
    | { tipo: OrganizacaoTipo.POLICLINICA; data: Policlinica }
    | { tipo: OrganizacaoTipo.UBS; data: UBS };

export type Organizacao = Policlinica | UBS;

export type OrganizacaoInfo = {
    tipo: 'policlinica' | 'ubs';
    cnes: string;
};

export interface JwtPayload {
    userId: string;
    organizacao?: OrganizacaoInfo;
}

export type PermissaoComPaciente<P> = P & { paciente: Paciente };

export interface ResultadoPaginado {
    items: Paciente[];
    total: number;
}
