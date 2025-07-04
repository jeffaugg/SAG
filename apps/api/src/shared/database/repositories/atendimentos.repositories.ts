import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAtendimentoDto } from 'src/modules/atendimentos/dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from 'src/modules/atendimentos/dto/update-atendimento.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IAtendimentoRepository } from './interface/atendimento-repository.interface';
import { Atendimento } from '@prisma/client';

@Injectable()
export class AtendimentosRepository implements IAtendimentoRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateAtendimentoDto): Promise<Atendimento> {
        return this.prisma.atendimento.create({
            data: {
                descricao: dto.descricao,
                unidade: { connect: { id: dto.unidadeId } },
                medico: { connect: { id: dto.medicoId } },
                gestacao: { connect: { id: dto.gestacaoId } },
                unidadeType: dto.unidadeType,
            },
        });
    }

    async findAll({ skip, limit }: PaginacaoDto) {
        const where = { deletedAt: null };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.atendimento.count({ where }),
            this.prisma.atendimento.findMany({
                where,
                include: {
                    medico: true,
                    gestacao: true,
                    unidade: true,
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'asc' },
            }),
        ]);

        return { items, total };
    }

    async findById(id: string): Promise<Atendimento> {
        const atendimento = await this.prisma.atendimento.findFirst({
            where: { id, deletedAt: null },
            include: { medico: true, gestacao: true, unidade: true },
        });
        if (!atendimento)
            throw new NotFoundException('Atendimento não encontrado');
        return atendimento;
    }

    async update(id: string, data: UpdateAtendimentoDto): Promise<Atendimento> {
        const atendimento = await this.prisma.atendimento.findFirst({
            where: { id, deletedAt: null },
        });
        if (!atendimento)
            throw new NotFoundException('Atendimento não encontrado');
        return this.prisma.atendimento.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
        });
    }

    async delete(id: string): Promise<void> {
        const atendimento = await this.prisma.atendimento.findFirst({
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
