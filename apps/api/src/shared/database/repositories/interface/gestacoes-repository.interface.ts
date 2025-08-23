import { CreateGestacaoDto } from 'src/modules/gestacoes/dto/create-gestacao.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Gestacao } from '@prisma/client';
import { UpdateGestacaoDto } from 'src/modules/gestacoes/dto/update-gestacao.dto';
import { GestacaoFiltroDto } from 'src/modules/gestacoes/dto/filtro-gestacao.dto';

export interface IGestacoesRepository {
    create(dto: CreateGestacaoDto): Promise<Gestacao>;
    findAll(pagination: PaginacaoDto): Promise<{
        items: Gestacao[];
        total: number;
    }>;
    findByPaciente(id: string): Promise<Gestacao[]>;
    findById(id: string): Promise<Gestacao | null>;
    update(id: string, data: UpdateGestacaoDto): Promise<Gestacao>;
    delete(id: string): Promise<Gestacao>;
    search(dto: GestacaoFiltroDto): Promise<{ items: any[]; total: number }>;
}
