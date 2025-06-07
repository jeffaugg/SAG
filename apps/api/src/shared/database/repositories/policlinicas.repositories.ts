import { CreatePoliclinicaDto } from 'src/modules/policlinicas/dto/create-policlinica.dto';
import { PrismaService } from '../prisma.service';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { IPoliclinicasRepository } from './interface/policlinica-repository.interface';

@Injectable()
export class PoliclinicasRepository implements IPoliclinicasRepository {
    constructor(private readonly prismaService: PrismaService) {}
    async create(createPoliclinicaDto: CreatePoliclinicaDto) {
        return await this.prismaService.policlinica.create({
            data: {
                cnes: createPoliclinicaDto.cnes,
                contato: createPoliclinicaDto.contato,
                localizacao: createPoliclinicaDto.localizacao,
                nome: createPoliclinicaDto.nome,
            },
        });
    }

    async findByCnes(cnes: string) {
        return await this.prismaService.policlinica.findUnique({
            where: {
                cnes,
                deletedAt: null,
            },
        });
    }

    async findAll({ skip, limit }: PaginacaoDto) {
        const where = { deletedAt: null };

        const [total, items] = await this.prismaService.$transaction([
            this.prismaService.policlinica.count({ where }),
            this.prismaService.policlinica.findMany({
                where,
                orderBy: { nome: 'asc' },
                skip,
                take: limit,
            }),
        ]);

        return { items, total };
    }

    async findById(id: string) {
        return await this.prismaService.policlinica.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    async update(id: string, data: CreatePoliclinicaDto) {
        return await this.prismaService.policlinica.update({
            where: { id },
            data: {
                updatedAt: new Date(),
                ...data,
            },
        });
    }

    async delete(id: string) {
        return await this.prismaService.policlinica.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async createUser(usuarioId: string, policlinicaId: string) {
        return await this.prismaService.policlinica.update({
            where: { id: policlinicaId },
            data: {
                usuarioPoliclinicas: {
                    create: {
                        usuario: {
                            connect: { id: usuarioId },
                        },
                    },
                },
            },
        });
    }

    async listUsers(cnes: string, { skip, limit }: PaginacaoDto) {
        const where = {
            cnes,
            deletedAt: null,
        };

        const [total, pivots] = await this.prismaService.$transaction([
            this.prismaService.usuarioPoliclinica.count({ where }),
            this.prismaService.usuarioPoliclinica.findMany({
                where,
                include: {
                    usuario: true,
                },
                skip,
                take: limit,
                orderBy: {
                    usuario: { nome: 'asc' },
                },
            }),
        ]);

        const items = pivots.map((p) => p.usuario);
        return { items, total };
    }
}
