import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { IUsuariosService } from './interface/usuario-service.interface';

@Injectable()
export class UsuariosService implements IUsuariosService {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: IUsuarioRepository,
    ) {}

    async getUsuariosById(id: string) {
        const usuario = await this.usuarioRepo.findById(id);

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return {
            id: usuario.id,
            name: usuario.nome,
            cargo: usuario.cargo,
            cpf: usuario.cpf,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
        };
    }

    async getOrganizacaoByUserId(userId: string) {
        return this.usuarioRepo.listAllOrganizacoes(userId);
    }
}
