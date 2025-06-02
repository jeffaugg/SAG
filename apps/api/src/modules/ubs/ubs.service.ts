import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUbsDto } from './dto/create-ubs.dto';
import { UpdateUbsDto } from './dto/update-ubs.dto';
import { IUbsService } from './interface/ubs-service.interface';
import { IUbsRepository } from 'src/shared/database/repositories/interface/ubs-repository.interface';
import { catchError } from 'src/shared/erro/catch-errors';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { UBS_REPOSITORY } from 'src/common/constants';

@Injectable()
export class UbsService implements IUbsService {
  constructor(
    @Inject(UBS_REPOSITORY)
    private readonly ubsRepository: IUbsRepository,
  ) {}

  async create(dto: CreateUbsDto) {
    const [erro, ubs] = await catchError(this.ubsRepository.create(dto));
    if (erro) throw new ConflictException('UBS já cadastrada');
    return ubs;
  }

  findAll(options: PaginacaoDto) {
    return this.ubsRepository.findAll(options);
  }

  async findOne(id: string) {
    const ubs = await this.ubsRepository.findById(id);
    if (!ubs) throw new NotFoundException('UBS não encontrada');
    return ubs;
  }

  async update(id: string, dto: UpdateUbsDto) {
    const [erro, ubs] = await catchError(this.ubsRepository.update(id, dto));
    if (erro) handlePrismaError(erro);
    return ubs;
  }

  async remove(id: string) {
    const [erro] = await catchError(this.ubsRepository.delete(id));
    if (erro) throw new NotFoundException('UBS não encontrada');
  }

  async createUser(usuarioId: string, ubsId: string) {
    const [erro, ubs] = await catchError(
      this.ubsRepository.createUser(usuarioId, ubsId),
    );
    if (erro) handlePrismaError(erro);
    return ubs;
  }

  async listUsers(cnes: string, options: PaginacaoDto) {
    const [erro, data] = await catchError(
      this.ubsRepository.listUsers(cnes, options),
    );
    if (erro) throw new NotFoundException('UBS não encontrada');
    return data;
  }
}
