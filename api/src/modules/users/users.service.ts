import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioRepository } from 'src/shared/database/repositories/usuarios.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  async getUserById(id: string) {
    const usuario = await this.usuarioRepo.findById(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      name: usuario.nome,
      cargo: usuario.cargo,
      cpf: usuario.cpf,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }
}
