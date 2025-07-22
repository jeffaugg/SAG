import { CreateAtendimentoDto } from '../dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from '../dto/update-atendimento.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Atendimento } from '@prisma/client';

export interface IAtendimentosService {
    create(dto: CreateAtendimentoDto): Promise<Atendimento>;
    findAll(
        options: PaginacaoDto,
    ): Promise<{ items: Atendimento[]; total: number }>;
    findById(id: string): Promise<Atendimento>;
    update(id: string, dto: UpdateAtendimentoDto): Promise<Atendimento>;
    remove(id: string): Promise<void>;
}
