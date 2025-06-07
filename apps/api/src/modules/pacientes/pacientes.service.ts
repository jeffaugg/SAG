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
import { PACIENTES_REPOSITORY } from 'src/common/constants';
import { IPacientesRepository } from 'src/shared/database/repositories/interface/pacientes-repository.interface';
import { IPacienteService } from './interface/pacientes-service.interface';

@Injectable()
export class PacientesService implements IPacienteService {
    constructor(
        @Inject(PACIENTES_REPOSITORY)
        private readonly pacientesRepository: IPacientesRepository,
    ) {}
    async create(createPacienteDto: CreatePacienteDto) {
        const [erro, paciente] = await catchError(
            this.pacientesRepository.create(createPacienteDto),
        );

        if (erro) throw new ConflictException('Paciente já cadastrado');

        return paciente;
    }

    findAll(options: PaginacaoDto) {
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
