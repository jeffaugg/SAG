import { Policlinica, Prisma, UBS } from '@prisma/client';
import { Usuario } from '@prisma/client';
import { OrganizacaoPorUsuario } from 'src/shared/types';

export interface IUsuarioRepository {
    create(args: Prisma.UsuarioCreateArgs): Promise<Usuario>;
    findByCpf(cpf: string): Promise<Usuario | null>;
    findById(id: string): Promise<Usuario | null>;
    findOrganizacaoById(
        usuarioId: string,
        orgCNES: string,
    ): Promise<OrganizacaoPorUsuario | null>;
    listAllOrganizacoes(
        usuarioId: string,
    ): Promise<{ policlinicas: Policlinica[]; ubs: UBS[] }>;
}
