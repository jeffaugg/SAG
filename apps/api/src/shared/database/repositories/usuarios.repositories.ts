import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { IUsuarioRepository } from './interface/usuario-repository.interface';
import { OrganizacaoPorUsuario, OrganizacaoTipo } from 'src/shared/types';
@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
    constructor(private readonly prismaService: PrismaService) {}
    async create(createUserDto: Prisma.UsuarioCreateArgs) {
        return await this.prismaService.usuario.create(createUserDto);
    }

    async findByCpf(cpf: string) {
        return await this.prismaService.usuario.findUnique({
            where: {
                cpf,
            },
        });
    }

    async findById(id: string) {
        return await this.prismaService.usuario.findUnique({
            where: {
                id,
            },
        });
    }

    async findOrganizacaoById(
        usuarioId: string,
        orgCNES: string,
    ): Promise<OrganizacaoPorUsuario | null> {
        const usuarioPoliclinica =
            await this.prismaService.usuarioPoliclinica.findUnique({
                where: {
                    cnes_usuarioId: {
                        cnes: orgCNES,
                        usuarioId: usuarioId,
                    },
                    usuario: {
                        deletedAt: null,
                    },
                },
                include: {
                    policlinica: true,
                },
            });

        if (usuarioPoliclinica)
            return {
                tipo: OrganizacaoTipo.POLICLINICA,
                data: usuarioPoliclinica.policlinica,
            };

        const usuarioUbs = await this.prismaService.usuarioUbs.findUnique({
            where: {
                cnes_usuarioId: {
                    cnes: orgCNES,
                    usuarioId: usuarioId,
                },
                usuario: {
                    deletedAt: null,
                },
            },
            include: {
                ubs: true,
            },
        });

        if (usuarioUbs)
            return { tipo: OrganizacaoTipo.UBS, data: usuarioUbs.ubs };

        return null;
    }

    async listAllOrganizacoes(usuarioCpf: string) {
        const result = await this.prismaService.usuario.findUnique({
            where: {
                cpf: usuarioCpf,
            },
            include: {
                usuarioPoliclinicas: {
                    where: { deletedAt: null },
                    include: { policlinica: true },
                },
                usuarioUbs: {
                    where: { deletedAt: null },
                    include: { ubs: true },
                },
            },
        });

        return {
            policlinicas:
                result?.usuarioPoliclinicas.map((p) => p.policlinica) || [],
            ubs: result?.usuarioUbs.map((u) => u.ubs) || [],
        };
    }
}
