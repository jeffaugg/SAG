import { CreateAtendimentoDto } from 'src/modules/atendimentos/dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from 'src/modules/atendimentos/dto/update-atendimento.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Atendimento } from '@prisma/client';

export interface IAtendimentoRepository {
    create(dto: CreateAtendimentoDto): Promise<Atendimento>;
    findAll(
        options: PaginacaoDto,
    ): Promise<{ items: Atendimento[]; total: number }>;
    findById(id: string): Promise<Atendimento>;
    update(id: string, dto: UpdateAtendimentoDto): Promise<Atendimento>;
    delete(id: string): Promise<void>;
    findByGestacaoId(
        gestacaoId: string,
        options: PaginacaoDto,
    ): Promise<{ items: Atendimento[]; total: number }>;
}
