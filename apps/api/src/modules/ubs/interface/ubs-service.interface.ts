import { CreateUbsDto } from '../dto/create-ubs.dto';
import { UpdateUbsDto } from '../dto/update-ubs.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UBS, Usuario } from '@prisma/client';

export interface IUbsService {
  create(dto: CreateUbsDto): Promise<UBS>;
  findAll(options: PaginacaoDto): Promise<{ items: UBS[]; total: number }>;
  findOne(id: string): Promise<UBS>;
  update(id: string, dto: UpdateUbsDto): Promise<UBS>;
  remove(id: string): Promise<void>;
  createUser(usuarioId: string, ubsId: string): Promise<UBS>;
  listUsers(
    cnes: string,
    options: PaginacaoDto,
  ): Promise<{
    items: Usuario[];
    total: number;
  }>;
}
