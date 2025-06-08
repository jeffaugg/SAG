import { CreatePoliclinicaDto } from 'src/modules/policlinicas/dto/create-policlinica.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Policlinica } from '@prisma/client';
import { Usuario } from '@prisma/client';

export interface IPoliclinicasRepository {
    create(dto: CreatePoliclinicaDto): Promise<Policlinica>;
    findByCnes(cnes: string): Promise<Policlinica | null>;
    findAll(pagination: PaginacaoDto): Promise<{
        items: Policlinica[];
        total: number;
    }>;
    findById(id: string): Promise<Policlinica | null>;
    update(id: string, data: CreatePoliclinicaDto): Promise<Policlinica>;
    delete(id: string): Promise<Policlinica>;
    createUser(usuarioId: string, policlinicaId: string): Promise<Policlinica>;
    listUsers(
        cnes: string,
        pagination: PaginacaoDto,
    ): Promise<{
        items: Usuario[];
        total: number;
    }>;
}
