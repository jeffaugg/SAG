import { CreateGestacaoDto } from 'src/modules/gestacoes/dto/create-gestacao.dto';
import { PrismaService } from '../prisma.service';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { IGestacoesRepository } from './interface/gestacoes-repository.interface';
import { Gestacao, Prisma } from '@prisma/client';
import { GestacaoFiltroDto } from 'src/modules/gestacoes/dto/filtro-gestacao.dto';

@Injectable()
export class GestacoesRepository implements IGestacoesRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async search(
        filtros: GestacaoFiltroDto,
    ): Promise<{ items: any[]; total: number }> {
        const { status, skip, limit } = filtros;

        const where: Prisma.GestacaoWhereInput = { deletedAt: null };
        console.log(status);
        if (status) where.status = status;

        const [total, items] = await this.prismaService.$transaction([
            this.prismaService.gestacao.count({ where }),
            this.prismaService.gestacao.findMany({
                where,
                orderBy: { inicio: 'asc' },
                skip,
                take: limit,
            }),
        ]);

        return { items, total };
    }

    async findByPaciente(id: string): Promise<Gestacao[]> {
        return this.prismaService.gestacao.findMany({
            where: {
                pacienteId: id,
                deletedAt: null,
            },
            orderBy: { inicio: 'asc' },
        });
    }
    async create(createGestacaoDto: CreateGestacaoDto) {
        return await this.prismaService.gestacao.create({
            data: {
                inicio: createGestacaoDto.inicio,
                fim: createGestacaoDto.fim,
                pacienteId: createGestacaoDto.pacienteId,
                status: createGestacaoDto.status,
            },
        });
    }

    async findAll({ skip, limit }: PaginacaoDto) {
        const where = { deletedAt: null };

        const [total, items] = await this.prismaService.$transaction([
            this.prismaService.gestacao.count({ where }),
            this.prismaService.gestacao.findMany({
                where,
                orderBy: { inicio: 'asc' },
                skip,
                take: limit,
            }),
        ]);

        return { items, total };
    }

    async findById(id: string) {
        return await this.prismaService.gestacao.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    async update(id: string, data: CreateGestacaoDto) {
        return await this.prismaService.gestacao.update({
            where: { id },
            data: {
                updatedAt: new Date(),
                ...data,
            },
        });
    }

    async delete(id: string) {
        return await this.prismaService.gestacao.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
