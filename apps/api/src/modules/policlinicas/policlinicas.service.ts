import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePoliclinicaDto } from './dto/create-policlinica.dto';
import { UpdatePoliclinicaDto } from './dto/update-policlinica.dto';
import { catchError } from 'src/shared/erro/catch-errors';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { POLICLINICAS_REPOSITORY } from 'src/common/constants';
import { IPoliclinicasRepository } from 'src/shared/database/repositories/interface/policlinica-repository.interface';
import { IPoliclinicasService } from './interface/policlinica-service.interface';
import { OrganizacaoInfo } from 'src/shared/types';

@Injectable()
export class PoliclinicasService implements IPoliclinicasService {
    constructor(
        @Inject(POLICLINICAS_REPOSITORY)
        private readonly policlinicasRepository: IPoliclinicasRepository,
    ) {}
    async create(createPoliclinicaDto: CreatePoliclinicaDto) {
        const [erro, policlinica] = await catchError(
            this.policlinicasRepository.create(createPoliclinicaDto),
        );

        if (erro) throw new ConflictException('Policlinica já cadastrada');

        return policlinica;
    }

    findAll(options: PaginacaoDto) {
        return this.policlinicasRepository.findAll(options);
    }

    async findOne(id: string) {
        const policlinica = await this.policlinicasRepository.findById(id);

        if (!policlinica)
            throw new NotFoundException('Policlinica não encontrada');

        return policlinica;
    }

    async update(id: string, updatePoliclinicaDto: UpdatePoliclinicaDto) {
        const [erro, policlinica] = await catchError(
            this.policlinicasRepository.update(id, updatePoliclinicaDto),
        );

        if (erro) handlePrismaError(erro);

        return policlinica;
    }

    async remove(id: string) {
        const [erro] = await catchError(this.policlinicasRepository.delete(id));

        if (erro) throw new NotFoundException('Policlinica não encontrada');
    }

    async createUser(usuarioId: string, policlinicaId: string) {
        const [erro, policlinica] = await catchError(
            this.policlinicasRepository.createUser(usuarioId, policlinicaId),
        );

        if (erro) handlePrismaError(erro);

        return policlinica;
    }

    async listUsers(policlinicaId: string, options: PaginacaoDto) {
        const [erro, policlinica] = await catchError(
            this.policlinicasRepository.listUsers(policlinicaId, options),
        );

        if (erro) throw new NotFoundException('Policlinica não encontrada');

        return policlinica;
    }

    async listPatients(orgInfo: OrganizacaoInfo, options: PaginacaoDto) {
        const [erro, policlinica] = await catchError(
            this.policlinicasRepository.listPatient(orgInfo.cnes, options),
        );

        if (erro) throw new NotFoundException('Policlinica não encontrada');

        return policlinica;
    }

    async getPatientByCpf(pacienteCpf: string, orgInfo: OrganizacaoInfo) {
        const [erro, result] = await catchError(
            this.policlinicasRepository.getPatientByCpf(
                pacienteCpf,
                orgInfo.cnes,
            ),
        );

        if (erro) throw new NotFoundException('Paciente não encontrado');

        return result?.paciente;
    }
}
