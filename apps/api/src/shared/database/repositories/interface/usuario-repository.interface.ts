import { Policlinica, Prisma, UBS } from '@prisma/client';
import { Usuario } from '@prisma/client';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
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
    update(id: string, updateUserDto: any): Promise<Usuario>;
    delete(id: string): Promise<Usuario>;
    listAllUsuarios(options: PaginacaoDto): Promise<{
        total: number;
        items: (Omit<Usuario, 'senha'> & {
            policlinicas: Policlinica[];
            ubs: UBS[];
        })[];
    }>;
}
