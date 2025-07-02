import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { IUsuariosService } from './interface/usuario-service.interface';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { handlePrismaError } from 'src/common/utils/prisma-error.util';
import { catchError } from 'src/shared/erro/catch-errors';
import { FilterUsuariosDto } from './dto/filter-usuarios.dto';

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

    async listAllUsuarios(options: FilterUsuariosDto) {
        return this.usuarioRepo.listAllUsuarios(options);
    }

    async update(id: string, updateUserDto: UpdateUsuariosDto) {
        const [erro, usuario] = await catchError(
            this.usuarioRepo.update(id, updateUserDto),
        );

        if (erro) handlePrismaError(erro);

        return usuario;
    }

    async delete(id: string) {
        const [erro] = await catchError(this.usuarioRepo.delete(id));

        if (erro) throw new NotFoundException('Usuário não encontrado');
    }
}
