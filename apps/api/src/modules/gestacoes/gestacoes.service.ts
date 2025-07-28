
// Importações dos módulos, tipos e utilitários necessários para a lógica de gestações
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


// Serviço responsável pela lógica de criação, busca, atualização e remoção de gestações
@Injectable()
export class GestacaoService implements IGestacaoService {
    /**
     * Injeta o repositório de gestações necessário para as operações do serviço
     */
    constructor(
        @Inject(GESTACOES_REPOSITORY)
        private readonly gestacoesRepository: IGestacoesRepository,
    ) {}
    async findByPaciente(id: string): Promise<Gestacao[]> {
        return this.gestacoesRepository.findByPaciente(id);
    }

    /**
     * Cria uma nova gestação
     * @param createGestacaoDto Dados da gestação
     */
    async create(createGestacaoDto: CreateGestacaoDto) {
        const [erro, gestacao] = await catchError(
            this.gestacoesRepository.create(createGestacaoDto),
        );

        if (erro) throw new ConflictException('Gestação já cadastrada');

        return gestacao;
    }

    /**
     * Lista todas as gestações, com paginação
     * @param options Opções de paginação
     */
    findAll(options: PaginacaoDto) {
        return this.gestacoesRepository.findAll(options);
    }

    /**
     * Busca uma gestação pelo ID
     * @param id ID da gestação
     */
    async findOne(id: string) {
        const gestacao = await this.gestacoesRepository.findById(id);
        if (!gestacao) throw new NotFoundException('Gestação não encontrada');
        return gestacao;
    }

    /**
     * Atualiza uma gestação pelo ID
     * @param id ID da gestação
     * @param updatePacienteDto Dados para atualização
     */
    async update(id: string, updatePacienteDto: UpdateGestacaoDto) {
        const [erro, gestacao] = await catchError(
            this.gestacoesRepository.update(id, updatePacienteDto),
        );
        if (erro) handlePrismaError(erro);
        return gestacao;
    }

    /**
     * Remove uma gestação pelo ID
     * @param id ID da gestação
     */
    async remove(id: string) {
        const [erro] = await catchError(this.gestacoesRepository.delete(id));
        if (erro) throw new NotFoundException('Gestação não encontrada');
    }
}
