import { CreatePacienteDto } from 'src/modules/pacientes/dto/create-paciente.dto';
import { PrismaService } from '../prisma.service';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { IPacientesRepository } from './interface/pacientes-repository.interface';
import { PermissoesPoliclinica, PermissoesUbs } from '@prisma/client';
import { PermissaoComPaciente, ResultadoPaginado } from 'src/shared/types';

@Injectable()
export class PacienteRepository implements IPacientesRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createPacienteDto: CreatePacienteDto) {
        return await this.prismaService.paciente.create({
            data: {
                nome: createPacienteDto.nome,
                cpf: createPacienteDto.cpf,
                telefone: createPacienteDto.telefone,
                endereco: createPacienteDto.endereco,
            },
        });
    }

    async findAll({ skip, limit }: PaginacaoDto) {
        const where = { deletedAt: null };

        const [total, items] = await this.prismaService.$transaction([
            this.prismaService.paciente.count({ where }),
            this.prismaService.paciente.findMany({
                where,
                orderBy: { nome: 'asc' },
                skip,
                take: limit,
            }),
        ]);

        return { items, total };
    }

    async findAllByOrganization(
        { skip, limit }: PaginacaoDto,
        orgCNES: string,
    ): Promise<ResultadoPaginado> {
        const fetchFrom = async <
            P extends PermissoesPoliclinica | PermissoesUbs,
        >(
            countQuery: () => Promise<number>,
            findQuery: () => Promise<PermissaoComPaciente<P>[]>,
        ): Promise<ResultadoPaginado> => {
            const total = await countQuery();
            if (total === 0) {
                return { items: [], total: 0 };
            }
            const records = await findQuery();
            const items = records.map((r) => r.paciente);
            return { items, total };
        };

        const policlinicaResult = await fetchFrom(
            () =>
                this.prismaService.permissoesPoliclinica.count({
                    where: { deletedAt: null, policlinicaCNES: orgCNES },
                }),
            () =>
                this.prismaService.permissoesPoliclinica.findMany({
                    where: { deletedAt: null, policlinicaCNES: orgCNES },
                    include: { paciente: true },
                    orderBy: { paciente: { nome: 'asc' } },
                    skip,
                    take: limit,
                }) as Promise<PermissaoComPaciente<PermissoesPoliclinica>[]>,
        );

        if (policlinicaResult.total > 0) {
            return policlinicaResult;
        }

        const ubsResult = await fetchFrom(
            () =>
                this.prismaService.permissoesUbs.count({
                    where: { deletedAt: null, ubsCNES: orgCNES },
                }),
            () =>
                this.prismaService.permissoesUbs.findMany({
                    where: { deletedAt: null, ubsCNES: orgCNES },
                    include: { paciente: true },
                    orderBy: { paciente: { nome: 'asc' } },
                    skip,
                    take: limit,
                }) as Promise<PermissaoComPaciente<PermissoesUbs>[]>,
        );

        if (ubsResult.total > 0) {
            return ubsResult;
        }

        return { items: [], total: 0 };
    }

    async findById(id: string) {
        return await this.prismaService.paciente.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    async findByCpf(cpf: string) {
        return await this.prismaService.paciente.findUnique({
            where: {
                cpf,
                deletedAt: null,
            },
        });
    }

    async update(id: string, data: CreatePacienteDto) {
        return await this.prismaService.paciente.update({
            where: { id },
            data: {
                updatedAt: new Date(),
                ...data,
            },
        });
    }

    async delete(id: string) {
        return await this.prismaService.paciente.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
