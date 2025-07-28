// Importações dos módulos, tipos e utilitários necessários para a lógica de pacientes
import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { catchError } from 'src/shared/erro/catch-errors';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import {
    ASSOCIACAO_STRATEGIES,
    PACIENTES_REPOSITORY,
} from 'src/common/constants';
import { IPacientesRepository } from 'src/shared/database/repositories/interface/pacientes-repository.interface';
import { IPacienteService } from './interface/pacientes-service.interface';
import { OrganizacaoInfo } from 'src/shared/types';
import { IAssociacaoStrategy } from './strategies/interface/associacao-strategy.interface';

// Serviço responsável pela lógica de cadastro, busca, atualização e associação de pacientes
@Injectable()
export class PacientesService implements IPacienteService {
    /**
     * Injeta o repositório de pacientes e o mapa de estratégias de associação
     */
    constructor(
        @Inject(PACIENTES_REPOSITORY)
        private readonly pacientesRepository: IPacientesRepository,
        @Inject(ASSOCIACAO_STRATEGIES)
        private readonly associacaoStrategies: Map<string, IAssociacaoStrategy>,
    ) {}
    /**
     * Cria um novo paciente e associa à organização informada.
     * Lança exceção se já existir ou se não houver estratégia de associação.
     */
    async create(
        createPacienteDto: CreatePacienteDto,
        orgInfo: OrganizacaoInfo,
    ) {
        // Tenta criar o paciente, capturando erro de duplicidade
        const [erro, paciente] = await catchError(
            this.pacientesRepository.create(createPacienteDto),
        );
        if (erro) throw new ConflictException('Paciente já cadastrado');

        // Busca a estratégia de associação conforme o tipo de organização
        const strategy = this.associacaoStrategies.get(orgInfo.tipo);
        if (!strategy) {
            throw new NotFoundException(
                `Strategy não implementada para ${orgInfo.tipo}`,
            );
        }

        // Realiza a associação do paciente à organização
        await strategy.association(paciente, orgInfo);

        return paciente;
    }

    /**
     * Associa um paciente existente a uma organização.
     * Lança exceção se não encontrar paciente ou estratégia.
     */
    async association(pacienteCpf: string, orgInfo: OrganizacaoInfo) {
        // Busca paciente pelo CPF
        const paciente = await this.pacientesRepository.findByCpf(pacienteCpf);
        if (!paciente) throw new NotFoundException('Paciente não encontrado');

        // Busca a estratégia de associação
        const strategy = this.associacaoStrategies.get(orgInfo.tipo);
        if (!strategy)
            throw new NotFoundException(
                `Strategy não implementada para ${orgInfo.tipo}`,
            );

        // Tenta associar paciente à organização
        const [error] = await catchError(
            strategy.association(paciente, orgInfo),
        );
        if (error)
            throw new ConflictException(
                'Erro ao associar paciente à organização',
            );
    }


    /**
     * Lista pacientes de uma organização específica, com paginação.
     */
    async findAllByOrganization(
        options: PaginacaoDto,
        orgInfo: OrganizacaoInfo,
    ) {
        return this.pacientesRepository.findAllByOrganization(
            options,
            orgInfo.cnes,
        );
    }


    /**
     * Lista todos os pacientes, com paginação.
     */
    async findAll(options: PaginacaoDto) {
        return this.pacientesRepository.findAll(options);
    }


    /**
     * Busca um paciente pelo ID. Lança exceção se não encontrar.
     */
    async findOne(id: string) {
        const paciente = await this.pacientesRepository.findById(id);
        if (!paciente) throw new NotFoundException('Paciente não encontrado');
        return paciente;
    }


    /**
     * Atualiza os dados de um paciente pelo ID.
     * Lança exceção se houver erro de banco.
     */
    async update(id: string, updatePacienteDto: UpdatePacienteDto) {
        const [erro, paciente] = await catchError(
            this.pacientesRepository.update(id, updatePacienteDto),
        );
        if (erro) handlePrismaError(erro);
        return paciente;
    }

    /**
     * Remove um paciente pelo ID. Lança exceção se não encontrar.
     */
    async remove(id: string) {
        const [erro] = await catchError(this.pacientesRepository.delete(id));
        if (erro) throw new NotFoundException('Paciente não encontrado');
    }
}
