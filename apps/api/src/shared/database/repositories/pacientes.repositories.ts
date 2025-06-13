import { CreatePacienteDto } from 'src/modules/pacientes/dto/create-paciente.dto';
import { PrismaService } from '../prisma.service';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { IPacientesRepository } from './interface/pacientes-repository.interface';

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

    async findById(id: string) {
        return await this.prismaService.paciente.findUnique({
            where: {
                id,
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
