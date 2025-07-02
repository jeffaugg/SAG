import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { IUsuarioRepository } from './interface/usuario-repository.interface';
import { OrganizacaoPorUsuario, OrganizacaoTipo } from 'src/shared/types';
import { UpdateUsuariosDto } from 'src/modules/usuarios/dto/update-usuarios.dto';
import { FilterUsuariosDto } from 'src/modules/usuarios/dto/filter-usuarios.dto';
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
                deletedAt: null,
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
                deletedAt: null,
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

    async update(id: string, updateUserDto: UpdateUsuariosDto) {
        return await this.prismaService.usuario.update({
            where: { id, deletedAt: null },
            data: {
                updatedAt: new Date(),
                ...updateUserDto,
            },
        });
    }

    async delete(id: string) {
        return await this.prismaService.usuario.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async listAllUsuarios({ skip, limit, cargo, cnes }: FilterUsuariosDto) {
        const where: Prisma.UsuarioWhereInput = {
            deletedAt: null,
            ...(cargo ? { cargo } : {}),
            ...(cnes
                ? {
                      OR: [
                          {
                              usuarioPoliclinicas: {
                                  some: { cnes, deletedAt: null },
                              },
                          },
                          { usuarioUbs: { some: { cnes, deletedAt: null } } },
                      ],
                  }
                : {}),
        };

        const [total, items] = await this.prismaService.$transaction([
            this.prismaService.usuario.count({
                where,
            }),
            this.prismaService.usuario.findMany({
                where,
                orderBy: {
                    nome: 'asc',
                },
                skip,
                take: limit,
                include: {
                    usuarioPoliclinicas: {
                        include: { policlinica: true },
                    },
                    usuarioUbs: {
                        include: { ubs: true },
                    },
                },
                omit: {
                    senha: true,
                },
            }),
        ]);
        return {
            items: items.map((u) => ({
                ...u,

                policlinicas: u.usuarioPoliclinicas.map((p) => p.policlinica),
                ubs: u.usuarioUbs.map((u) => u.ubs),
            })),
            total,
        };
    }
}
