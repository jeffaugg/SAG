import { Policlinica, UBS, Usuario } from '@prisma/client';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UpdateUsuariosDto } from '../dto/update-usuarios.dto';

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
    listAllUsuarios(options: PaginacaoDto): Promise<{
        total: number;
        items: (Omit<Usuario, 'senha'> & {
            policlinicas: Policlinica[];
            ubs: UBS[];
        })[];
    }>;
    update(id: string, updateUserDto: UpdateUsuariosDto): Promise<Usuario>;
    delete(id: string): Promise<void>;
}
