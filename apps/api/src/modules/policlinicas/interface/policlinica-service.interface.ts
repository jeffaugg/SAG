import { CreatePoliclinicaDto } from '../dto/create-policlinica.dto';
import { UpdatePoliclinicaDto } from '../dto/update-policlinica.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Policlinica, Usuario } from '@prisma/client';

export interface IPoliclinicasService {
  create(dto: CreatePoliclinicaDto): Promise<Policlinica>;
  findAll(
    options: PaginacaoDto,
  ): Promise<{ items: Policlinica[]; total: number }>;
  findOne(id: string): Promise<Policlinica>;
  update(id: string, dto: UpdatePoliclinicaDto): Promise<Policlinica>;
  remove(id: string): Promise<void>;
  createUser(usuarioId: string, policlinicaId: string): Promise<Policlinica>;
  listUsers(
    policlinicaId: string,
    options: PaginacaoDto,
  ): Promise<{
    items: Usuario[];
    total: number;
  }>;
}
