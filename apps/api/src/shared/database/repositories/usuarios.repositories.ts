import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { IUsuarioRepository } from './interface/usuario-repository.interface';
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
}
