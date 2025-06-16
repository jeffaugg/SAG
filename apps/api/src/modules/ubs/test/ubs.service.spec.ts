import { Test, TestingModule } from '@nestjs/testing';
import { IUbsService } from '../interface/ubs-service.interface';
import { UbsService } from '../ubs.service';
import { UBS_SERVICE, UBS_REPOSITORY } from 'src/common/constants';
// import { UbsRepository } from 'src/shared/database/repositories/ubs.repositories';
import { UbsMock, UsuarioMock } from 'test/shared/types';
import { IUbsRepository } from 'src/shared/database/repositories/interface/ubs-repository.interface';
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker/locale/pt_BR';

describe('UBS service', () => {
    let ubsRepository: IUbsRepository;
    let ubsService: IUbsService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UBS_REPOSITORY,
                    useValue: {},
                },
                {
                    provide: UBS_SERVICE,
                    useClass: UbsService,
                },
            ],
        }).compile();

        ubsService = moduleFixture.get<IUbsService>(UBS_SERVICE);
        ubsRepository = moduleFixture.get<IUbsRepository>(UBS_REPOSITORY);
    });

    it('deve ser definido', () => {
        expect(ubsService).toBeDefined();
    });

    const mock = UbsMock();

    it('deve ser criada uma UBS', async () => {
        ubsRepository.create = jest.fn().mockResolvedValueOnce(mock);

        const result = await ubsService.create({
            nome: mock.nome,
            cnes: mock.cnes,
            contato: mock.contato,
            localizacao: mock.localizacao,
        });
        expect(result).toEqual(mock);
    });

    it('não deve permitir criar UBS duplicada', async () => {
        ubsRepository.create = jest.fn().mockRejectedValueOnce(new Error());

        await expect(
            ubsService.create({
                nome: mock.nome,
                cnes: mock.cnes,
                contato: mock.contato,
                localizacao: mock.localizacao,
            }),
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('deve retornar todas as UBS', async () => {
        const mocks = [UbsMock(), UbsMock(), UbsMock()];

        ubsRepository.findAll = jest.fn().mockResolvedValueOnce({
            items: mocks,
            total: 3,
        });

        const result = await ubsService.findAll({ limit: 3, page: 1, skip: 0 });

        expect(result.items).toHaveLength(3);
        expect(result.items).toEqual(mocks);
        expect(result.total).toBe(3);
    });

    it('não deve retornar UBS com ID inexistente', async () => {
        const id = faker.string.uuid();
        ubsRepository.findById = jest.fn().mockResolvedValueOnce(null);

        await expect(ubsService.findById(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('não deve retornar UBS com CNES inexistente', async () => {
        const cnes = faker.string.uuid();
        ubsRepository.findByCnes = jest.fn().mockResolvedValueOnce(null);

        await expect(ubsService.findByCnes(cnes)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('não deve atualizar UBS inexistente', async () => {
        const id = faker.string.uuid();
        const mock = UbsMock();
        ubsRepository.update = jest.fn().mockRejectedValueOnce(new Error());

        await expect(
            ubsService.update(id, {
                nome: mock.nome,
                cnes: mock.cnes,
                contato: mock.contato,
                localizacao: mock.localizacao,
            }),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('não deve deletar UBS inexistente', async () => {
        const id = faker.string.uuid();
        ubsRepository.delete = jest.fn().mockRejectedValueOnce(new Error());

        await expect(ubsService.remove(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('deve associar um usuário a uma UBS', async () => {
        const userId = faker.string.uuid();
        const id = faker.string.uuid();
        const mock = UbsMock();
        ubsRepository.createUser = jest.fn().mockResolvedValueOnce(mock);

        await expect(ubsService.createUser(userId, id)).resolves.toEqual(mock);
    });

    it('não deve associar usuário a UBS inexistente', async () => {
        const userId = faker.string.uuid();
        const id = faker.string.uuid();

        ubsRepository.createUser = jest.fn().mockRejectedValueOnce(new Error());

        await expect(ubsService.createUser(userId, id)).rejects.toBeInstanceOf(
            InternalServerErrorException,
        );
    });

    it('deve listar usuários de uma UBS', async () => {
        const cnes = faker.string.uuid();
        const mockUsers = [UsuarioMock(), UsuarioMock()];

        ubsRepository.listUsers = jest.fn().mockResolvedValueOnce({
            items: mockUsers,
            total: 2,
        });

        const result = await ubsService.listUsers(cnes, {
            limit: 2,
            page: 1,
            skip: 0,
        });

        expect(result.items).toHaveLength(2);
        expect(result.items).toEqual(mockUsers);
        expect(result.total).toBe(2);
    });

    it('não deve listar usuários de UBS inexistente', async () => {
        const cnes = faker.string.uuid();

        ubsRepository.listUsers = jest.fn().mockRejectedValueOnce(new Error());

        await expect(
            ubsService.listUsers(cnes, { limit: 2, page: 1, skip: 0 }),
        ).rejects.toBeInstanceOf(NotFoundException);
    });
});
