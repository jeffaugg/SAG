import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Gestacao } from '@prisma/client';
import { GESTACOES_REPOSITORY } from 'src/common/constants';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { IGestacoesRepository } from 'src/shared/database/repositories/interface/gestacoes-repository.interface';
import { catchError } from 'src/shared/erro/catch-errors';
import { CreateGestacaoDto } from './dto/create-gestacao.dto';
import { UpdateGestacaoDto } from './dto/update-gestacao.dto';
import { IGestacaoService } from './interface/gestacoes-service.interface';

@Injectable()
export class GestacaoService implements IGestacaoService {
    constructor(
        @Inject(GESTACOES_REPOSITORY)
        private readonly gestacoesRepository: IGestacoesRepository,
    ) {}
    async findByPaciente(
        id: string,
        options: PaginacaoDto,
    ): Promise<{ items: Gestacao[]; total: number }> {
        return this.gestacoesRepository.findByPaciente(id, options);
    }
    async create(createGestacaoDto: CreateGestacaoDto) {
        const [erro, gestacao] = await catchError(
            this.gestacoesRepository.create(createGestacaoDto),
        );

        if (erro) {
            console.error('Erro ao criar gestação:', erro);
            throw new ConflictException('Erro ao criar gestação');
        }

        return gestacao;
    }

    findAll(options: PaginacaoDto) {
        return this.gestacoesRepository.findAll(options);
    }

    async findOne(id: string) {
        const gestacao = await this.gestacoesRepository.findById(id);

        if (!gestacao) throw new NotFoundException('Gestação não encontrada');

        return gestacao;
    }

    async update(id: string, updatePacienteDto: UpdateGestacaoDto) {
        const [erro, gestacao] = await catchError(
            this.gestacoesRepository.update(id, updatePacienteDto),
        );

        if (erro) handlePrismaError(erro);

        return gestacao;
    }

    async remove(id: string) {
        const [erro] = await catchError(this.gestacoesRepository.delete(id));

        if (erro) throw new NotFoundException('Gestação não encontrada');
    }
}
