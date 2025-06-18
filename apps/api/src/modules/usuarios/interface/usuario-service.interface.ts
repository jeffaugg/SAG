import { Policlinica, UBS } from '@prisma/client';

export interface IUsuariosService {
    getUsuariosById(id: string): Promise<{
        id: string;
        name: string;
        cargo: string;
        cpf: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getOrganizacaoByUserId(
        usuarioCpf: string,
    ): Promise<{ policlinicas: Policlinica[]; ubs: UBS[] }>;
}
