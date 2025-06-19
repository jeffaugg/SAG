import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { UsuarioMock } from 'test/shared/types';
import { IUsuariosService } from '../interface/usuario-service.interface';
import { USUARIO_REPOSITORY, USUARIOS_SERVICE } from 'src/common/constants';
import { UsuarioRepository } from 'src/shared/database/repositories/usuarios.repositories';
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from '../usuarios.service';
import { faker } from '@faker-js/faker/locale/pt_BR';

import {
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

describe('Usuario service', () => {
    let usuarioRepository: IUsuarioRepository;
    let usuarioService: IUsuariosService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: USUARIO_REPOSITORY,
                    useValue: { UsuarioRepository },
                },
                {
                    provide: USUARIOS_SERVICE,
                    useClass: UsuariosService,
                },
            ],
        }).compile();

        usuarioService = moduleFixture.get<IUsuariosService>(USUARIOS_SERVICE);
        usuarioRepository =
            moduleFixture.get<IUsuarioRepository>(USUARIO_REPOSITORY);
    });

    it('deve ser definido', () => {
        expect(usuarioService).toBeDefined();
    });

    const mock = UsuarioMock();

    it('deve ser retornado todos os usuários', async () => {
        const mocks = [UsuarioMock(), UsuarioMock(), UsuarioMock()];
        usuarioRepository.listAllUsuarios = jest.fn().mockResolvedValueOnce({
            items: mocks,
            total: 3,
        });

        const result = await usuarioService.listAllUsuarios({
            limit: 3,
            page: 1,
            skip: 0,
        });

        expect(result.items).toHaveLength(3);
        expect(result.items).toEqual(mocks);
        expect(result.total).toBe(3);
    });

    it('deve atualizar um usuário', async () => {
        const mock = UsuarioMock();
        usuarioRepository.update = jest.fn().mockResolvedValueOnce(mock);

        const result = await usuarioService.update(faker.string.uuid(), {
            nome: mock.nome,
            cargo: mock.cargo,
        });

        expect(result).toEqual(mock);
    });

    it('nao deve atualizar um usuário inexistente', async () => {
        usuarioRepository.update = jest.fn().mockRejectedValueOnce(new Error());

        await expect(
            usuarioService.update(faker.string.uuid(), {
                nome: faker.person.fullName(),
                cargo: mock.cargo,
            }),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('deve ser deletado um usuário', async () => {
        const mock = UsuarioMock();
        usuarioRepository.delete = jest.fn().mockResolvedValueOnce(mock);

        const result = await usuarioService.delete(faker.string.uuid());

        expect(result).toEqual(undefined);
    });

    it('nao deve deletar um usuário inexistente', async () => {
        usuarioRepository.delete = jest.fn().mockRejectedValueOnce(new Error());

        await expect(
            usuarioService.delete(faker.string.uuid()),
        ).rejects.toBeInstanceOf(NotFoundException);
    });
});
