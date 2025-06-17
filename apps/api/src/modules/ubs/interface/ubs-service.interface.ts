import { CreateUbsDto } from '../dto/create-ubs.dto';
import { UpdateUbsDto } from '../dto/update-ubs.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Paciente, UBS, Usuario } from '@prisma/client';
import { OrganizacaoInfo } from 'src/shared/types';

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
    listPatients(
        orgInfo: OrganizacaoInfo,
        options: PaginacaoDto,
    ): Promise<{ items: Paciente[] | undefined[]; total: number }>;

    getPatientByCpf(
        pacienteCpf: string,
        orgInfo: OrganizacaoInfo,
    ): Promise<Paciente | undefined>;
}
