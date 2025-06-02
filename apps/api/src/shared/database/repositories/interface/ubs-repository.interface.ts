import { CreateUbsDto } from 'src/modules/ubs/dto/create-ubs.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UBS, Usuario } from '@prisma/client';

export interface IUbsRepository {
  create(dto: CreateUbsDto): Promise<UBS>;
  findByCnes(cnes: string): Promise<UBS | null>;
  findAll(pagination: PaginacaoDto): Promise<{ items: UBS[]; total: number }>;
  findById(id: string): Promise<UBS | null>;
  update(id: string, data: CreateUbsDto): Promise<UBS>;
  delete(id: string): Promise<UBS>;
  createUser(usuarioId: string, ubsId: string): Promise<UBS>;
  listUsers(
    cnes: string,
    pagination: PaginacaoDto,
  ): Promise<{ items: Usuario[]; total: number }>;
}
