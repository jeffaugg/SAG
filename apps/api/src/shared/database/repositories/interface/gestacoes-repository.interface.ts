import { CreateGestacaoDto } from 'src/modules/gestacoes/dto/create-gestacao.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Gestacao } from '@prisma/client';
import { UpdateGestacaoDto } from 'src/modules/gestacoes/dto/update-gestacao.dto';

export interface IGestacoesRepository {
  create(dto: CreateGestacaoDto): Promise<Gestacao>;
  findAll(pagination: PaginacaoDto): Promise<{
    items: Gestacao[];
    total: number;
  }>;
  findByPaciente(
    id: string,
    pagination: PaginacaoDto,
  ): Promise<{
    items: Gestacao[];
    total: number;
  }>;
  findById(id: string): Promise<Gestacao | null>;
  update(id: string, data: UpdateGestacaoDto): Promise<Gestacao>;
  delete(id: string): Promise<Gestacao>;
}
