import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Paciente } from '@prisma/client';
import { OrganizacaoInfo } from 'src/shared/types';

export interface IPacienteService {
    create(dto: CreatePacienteDto, orgInfo: OrganizacaoInfo): Promise<Paciente>;
    findAll(
        options: PaginacaoDto,
    ): Promise<{ items: Paciente[]; total: number }>;
    findOne(id: string): Promise<Paciente>;
    update(id: string, dto: UpdatePacienteDto): Promise<Paciente>;
    remove(id: string): Promise<void>;
    association(pacienteCpf: string, orgInfo: OrganizacaoInfo): Promise<void>;
    findAllByOrganization(
        options: PaginacaoDto,
        orgInfo: OrganizacaoInfo,
    ): Promise<{ items: Paciente[]; total: number }>;
}
