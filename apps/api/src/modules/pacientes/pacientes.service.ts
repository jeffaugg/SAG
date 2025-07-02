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

@Injectable()
export class PacientesService implements IPacienteService {
    constructor(
        @Inject(PACIENTES_REPOSITORY)
        private readonly pacientesRepository: IPacientesRepository,
        @Inject(ASSOCIACAO_STRATEGIES)
        private readonly associacaoStrategies: Map<string, IAssociacaoStrategy>,
    ) {}
    async create(
        createPacienteDto: CreatePacienteDto,
        orgInfo: OrganizacaoInfo,
    ) {
        const [erro, paciente] = await catchError(
            this.pacientesRepository.create(createPacienteDto),
        );

        if (erro) throw new ConflictException('Paciente já cadastrado');

        const strategy = this.associacaoStrategies.get(orgInfo.tipo);

        if (!strategy) {
            throw new NotFoundException(
                `Strategy não implementada para ${orgInfo.tipo}`,
            );
        }

        await strategy.association(paciente, orgInfo);

        return paciente;
    }

    async association(pacienteCpf: string, orgInfo: OrganizacaoInfo) {
        const paciente = await this.pacientesRepository.findByCpf(pacienteCpf);

        if (!paciente) throw new NotFoundException('Paciente não encontrado');

        const strategy = this.associacaoStrategies.get(orgInfo.tipo);

        if (!strategy)
            throw new NotFoundException(
                `Strategy não implementada para ${orgInfo.tipo}`,
            );

        const [error] = await catchError(
            strategy.association(paciente, orgInfo),
        );

        if (error)
            throw new ConflictException(
                'Erro ao associar paciente à organização',
            );
    }

    async findAllByOrganization(
        options: PaginacaoDto,
        orgInfo: OrganizacaoInfo,
    ) {
        return this.pacientesRepository.findAllByOrganization(
            options,
            orgInfo.cnes,
        );
    }

    async findAll(options: PaginacaoDto) {
        return this.pacientesRepository.findAll(options);
    }

    async findOne(id: string) {
        const paciente = await this.pacientesRepository.findById(id);

        if (!paciente) throw new NotFoundException('Paciente não encontrado');

        return paciente;
    }

    async update(id: string, updatePacienteDto: UpdatePacienteDto) {
        const [erro, paciente] = await catchError(
            this.pacientesRepository.update(id, updatePacienteDto),
        );

        if (erro) handlePrismaError(erro);

        return paciente;
    }

    async remove(id: string) {
        const [erro] = await catchError(this.pacientesRepository.delete(id));

        if (erro) throw new NotFoundException('Paciente não encontrado');
    }
}
