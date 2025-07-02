import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUbsDto } from 'src/modules/ubs/dto/create-ubs.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IUbsRepository } from './interface/ubs-repository.interface';

@Injectable()
export class UbsRepository implements IUbsRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateUbsDto) {
        return this.prisma.uBS.create({ data });
    }

    async findByCnes(cnes: string) {
        return this.prisma.uBS.findUnique({ where: { cnes, deletedAt: null } });
    }

    async findAll({ skip, limit }: PaginacaoDto) {
        const where = { deletedAt: null };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.uBS.count({ where }),
            this.prisma.uBS.findMany({
                where,
                skip,
                take: limit,
                orderBy: { nome: 'asc' },
            }),
        ]);

        return { items, total };
    }

    async findById(id: string) {
        return this.prisma.uBS.findUnique({ where: { id, deletedAt: null } });
    }

    async update(id: string, data: CreateUbsDto) {
        return this.prisma.uBS.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
        });
    }

    async delete(id: string) {
        return this.prisma.uBS.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async createUser(usuarioId: string, ubsId: string) {
        return this.prisma.uBS.update({
            where: { id: ubsId },
            data: {
                usuarioUbs: {
                    create: { usuario: { connect: { id: usuarioId } } },
                },
            },
        });
    }

    async listUsers(cnes: string, { skip, limit }: PaginacaoDto) {
        const where = { cnes, deletedAt: null };

        const [total, pivots] = await this.prisma.$transaction([
            this.prisma.usuarioUbs.count({ where }),
            this.prisma.usuarioUbs.findMany({
                where,
                include: { usuario: true },
                skip,
                take: limit,
                orderBy: { usuario: { nome: 'asc' } },
            }),
        ]);

        const items = pivots.map((p) => p.usuario);
        return { items, total };
    }

    async listPatient(ubsCNES: string, { skip, limit }: PaginacaoDto) {
        const where = { ubsCNES, deletedAt: null };

        const [total, pivots] = await this.prisma.$transaction([
            this.prisma.permissoesUbs.count({ where }),
            this.prisma.permissoesUbs.findMany({
                where,
                include: { paciente: true },
                skip,
                take: limit,
                orderBy: { paciente: { nome: 'asc' } },
            }),
        ]);
        const items = pivots.map((p) => p.paciente);

        return { items, total };
    }

    async getPatientByCpf(pacienteCpf: string, ubsCNES: string) {
        return this.prisma.permissoesUbs.findUniqueOrThrow({
            where: {
                pacienteCpf_ubsCNES: {
                    pacienteCpf,
                    ubsCNES,
                },
                paciente: { deletedAt: null },
            },
            include: {
                paciente: true,
            },
        });
    }
}
