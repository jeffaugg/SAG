import { Injectable, NotFoundException } from '@nestjs/common';
import { Atendimento } from '@prisma/client';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { CreateAtendimentoDto } from 'src/modules/atendimentos/dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from 'src/modules/atendimentos/dto/update-atendimento.dto';
import { PrismaService } from '../prisma.service';
import { IAtendimentoRepository } from './interface/atendimento-repository.interface';

@Injectable()
export class AtendimentosRepository implements IAtendimentoRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        dto: CreateAtendimentoDto & {
            medicoId: string;
            ubsId: string | null;
            policlinicaId: string | null;
        },
        files: string[],
    ): Promise<Atendimento> {
        return this.prisma.atendimento.create({
            data: {
                ...dto,
                AtendimentoArquivo: {
                    create: files.map((file) => ({ arquivoUrl: file })),
                },
            },
            include: {
                AtendimentoArquivo: true,
            },
        });
    }

    async findAll({ skip, limit }: PaginacaoDto) {
        const where = { deletedAt: null };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.atendimento.count({ where }),
            this.prisma.atendimento.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'asc' },
                include: {
                    medico: true,
                    gestacao: true,
                    policlinica: true,
                    ubs: true,
                    AtendimentoArquivo: true,
                },
            }),
        ]);

        return { items, total };
    }

    async findById(id: string): Promise<Atendimento> {
        const atendimento = await this.prisma.atendimento.findFirst({
            where: { id, deletedAt: null },
            include: {
                medico: true,
                gestacao: true,
                policlinica: true,
                ubs: true,
                AtendimentoArquivo: true,
            },
        });
        if (!atendimento)
            throw new NotFoundException('Atendimento não encontrado');
        return atendimento;
    }

    async update(id: string, data: UpdateAtendimentoDto): Promise<Atendimento> {
        const atendimento = await this.prisma.atendimento.findUnique({
            where: { id, deletedAt: null },
        });
        if (!atendimento)
            throw new NotFoundException('Atendimento não encontrado');
        return this.prisma.atendimento.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
        });
    }

    async findByGestacaoId(gestacaoId: string, { skip, limit }: PaginacaoDto) {
        const where = { gestacaoId, deletedAt: null };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.atendimento.count({ where }),
            this.prisma.atendimento.findMany({
                where,
                include: {
                    medico: true,
                    gestacao: true,
                    AtendimentoArquivo: true,
                    policlinica: true,
                    ubs: true,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return { items, total };
    }

    async delete(id: string): Promise<void> {
        const atendimento = await this.prisma.atendimento.findUnique({
            where: { id, deletedAt: null },
        });
        if (!atendimento)
            throw new NotFoundException('Atendimento não encontrado');
        await this.prisma.atendimento.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
