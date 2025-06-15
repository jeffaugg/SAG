import { CreatePoliclinicaDto } from '../dto/create-policlinica.dto';
import { UpdatePoliclinicaDto } from '../dto/update-policlinica.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Paciente, Policlinica, Usuario } from '@prisma/client';
import { OrganizacaoInfo } from 'src/shared/types';

export interface IPoliclinicasService {
    create(dto: CreatePoliclinicaDto): Promise<Policlinica>;
    findAll(
        options: PaginacaoDto,
    ): Promise<{ items: Policlinica[]; total: number }>;
    findOne(id: string): Promise<Policlinica>;
    update(id: string, dto: UpdatePoliclinicaDto): Promise<Policlinica>;
    remove(id: string): Promise<void>;
    createUser(usuarioId: string, policlinicaId: string): Promise<Policlinica>;
    listUsers(
        policlinicaId: string,
        options: PaginacaoDto,
    ): Promise<{
        items: Usuario[];
        total: number;
    }>;
    listPatients(
        orgInfo: OrganizacaoInfo,
        options: PaginacaoDto,
    ): Promise<{ items: Paciente[] | undefined[]; total: number }>;

    getPatientByCpf(
        pacienteCpf: string,
        orgInfo: OrganizacaoInfo,
    ): Promise<Paciente | undefined>;
}
