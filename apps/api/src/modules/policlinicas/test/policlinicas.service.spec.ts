import { Test, TestingModule } from '@nestjs/testing';
import { IPoliclinicasService } from '../interface/policlinica-service.interface';
import { PoliclinicasService } from '../policlinicas.service';
import {
    POLICLINICAS_SERVICE,
    POLICLINICAS_REPOSITORY,
} from 'src/common/constants';
import { PoliclinicasRepository } from 'src/shared/database/repositories/policlinicas.repositories';
import { PoliclinicaMock } from 'test/shared/types';
import { IPoliclinicasRepository } from 'src/shared/database/repositories/interface/policlinica-repository.interface';
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker/locale/pt_BR';

describe('Policlinicas service', () => {
    let policlinicaRepository: IPoliclinicasRepository;
    let policlinicaService: IPoliclinicasService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: POLICLINICAS_REPOSITORY,
                    useValue: { PoliclinicasRepository },
                },
                {
                    provide: POLICLINICAS_SERVICE,
                    useClass: PoliclinicasService,
                },
            ],
        }).compile();

        policlinicaService =
            moduleFixture.get<IPoliclinicasService>(POLICLINICAS_SERVICE);
        policlinicaRepository = moduleFixture.get<IPoliclinicasRepository>(
            POLICLINICAS_REPOSITORY,
        );
    });

    it('deve ser definido', () => {
        expect(policlinicaService).toBeDefined();
    });

    const mock = PoliclinicaMock();
    it('deve ser criado uma policlinica', async () => {
        policlinicaRepository.create = jest.fn().mockResolvedValueOnce(mock);

        const result = await policlinicaService.create({
            nome: mock.nome,
            cnes: mock.cnes,
            contato: mock.contato,
            localizacao: mock.localizacao,
        });
        expect(result).toEqual(mock);
    });

    it('não deve permitir ser criado uma policlinica repetida', async () => {
        policlinicaRepository.create = jest
            .fn()
            .mockRejectedValueOnce(new Error());

        await expect(
            policlinicaService.create({
                nome: mock.nome,
                cnes: mock.cnes,
                contato: mock.contato,
                localizacao: mock.localizacao,
            }),
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('deve ser retornado todas as policlinicas', async () => {
        const mocks = [PoliclinicaMock(), PoliclinicaMock(), PoliclinicaMock()];

        policlinicaRepository.findAll = jest.fn().mockResolvedValueOnce({
            items: mocks,
            total: 3,
        });

        const result = await policlinicaService.findAll({
            limit: 3,
            page: 1,
            skip: 0,
        });

        expect(result.items).toHaveLength(3);
        expect(result.items).toEqual(mocks);
        expect(result.total).toBe(3);
    });

    it('não deve retornar policlinicas com ID inexistente', async () => {
        const id = faker.string.uuid();
        policlinicaRepository.findById = jest.fn().mockResolvedValueOnce(null);

        await expect(policlinicaService.findOne(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('não deve retornar policlinicas com CNES inexistente', async () => {
        const cnes = faker.string.uuid();
        policlinicaRepository.findByCnes = jest
            .fn()
            .mockResolvedValueOnce(null);

        await expect(policlinicaService.findOne(cnes)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('não deve atualizar policlinica inexistente', async () => {
        const id = faker.string.uuid();
        const mock = PoliclinicaMock();
        policlinicaRepository.update = jest
            .fn()
            .mockRejectedValueOnce(new Error());

        await expect(
            policlinicaService.update(id, {
                cnes: mock.cnes,
                contato: mock.contato,
                localizacao: mock.localizacao,
                nome: mock.nome,
            }),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('não deve deletar policlinica inexistente', async () => {
        const id = faker.string.uuid();

        policlinicaRepository.delete = jest
            .fn()
            .mockRejectedValueOnce(new Error());

        await expect(policlinicaService.remove(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });
});
