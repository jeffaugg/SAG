import { CreateGestacaoDto } from '../dto/create-gestacao.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Gestacao } from '@prisma/client';
import { UpdateGestacaoDto } from '../dto/update-gestacao.dto';

export interface IGestacaoService {
  create(dto: CreateGestacaoDto): Promise<Gestacao>;
  findOne(id: string): Promise<Gestacao>;
  findByPaciente(
    id: string,
    options: PaginacaoDto,
  ): Promise<{ items: Gestacao[]; total: number }>;
  update(id: string, dto: UpdateGestacaoDto): Promise<Gestacao>;
  remove(id: string): Promise<void>;
  findAll(options: PaginacaoDto): Promise<{ items: Gestacao[]; total: number }>;
}
