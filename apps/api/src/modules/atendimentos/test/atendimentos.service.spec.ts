import { Test, TestingModule } from '@nestjs/testing';
import { IAtendimentosService } from '../interface/atendimentos-service.interface';
import { IAtendimentoRepository } from 'src/shared/database/repositories/interface/atendimento-repository.interface';
import { AtendimentosService } from '../atendimentos.service';
import {
    ATENDIMENTOS_REPOSITORY,
    ATENDIMENTOS_SERVICE,
} from 'src/common/constants';
import { AtendimentosMock } from 'test/shared/types';
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker/locale/pt_BR';

describe('Atendimentos service', () => {
    let atendimentosService: IAtendimentosService;
    let atendimentosRepository: IAtendimentoRepository;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ATENDIMENTOS_REPOSITORY,
                    useValue: {},
                },
                {
                    provide: ATENDIMENTOS_SERVICE,
                    useClass: AtendimentosService,
                },
            ],
        }).compile();

        atendimentosService =
            moduleFixture.get<IAtendimentosService>(ATENDIMENTOS_SERVICE);
        atendimentosRepository = moduleFixture.get<IAtendimentoRepository>(
            ATENDIMENTOS_REPOSITORY,
        );
    });

    it('deve ser definido', () => {
        expect(atendimentosService).toBeDefined();
    });

    const mock = AtendimentosMock();

    it('deve ser criado um atendimento', async () => {
        atendimentosRepository.create = jest
            .fn()
            .mockRejectedValueOnce(new Error());

        await expect(
            atendimentosService.create({
                descricao: mock.descricao,
                unidadeId: mock.unidadeId,
                medicoId: mock.medicoId,
                gestacaoId: mock.gestacaoId,
                unidadeType: mock.unidadeType,
            }),
        ).rejects.toThrow(ConflictException);
    });

    it('deve retornar todos os atendimentos', async () => {
        const mocks = Array.from({ length: 3 }, () => AtendimentosMock());
        atendimentosRepository.findAll = jest.fn().mockResolvedValueOnce({
            items: mocks,
            total: 3,
        });

        const result = await atendimentosService.findAll({
            limit: 10,
            page: 1,
            skip: 0,
        });
        expect(result.items).toHaveLength(3);
        expect(result.items).toEqual(mocks);
        expect(result.total).toBe(3);
    });

    it('deve retornar um atendimento por ID', async () => {
        const id = faker.string.uuid();
        const mock = AtendimentosMock();
        atendimentosRepository.findById = jest.fn().mockResolvedValueOnce(mock);
        const result = await atendimentosService.findById(id);
        expect(result).toEqual(mock);
    });

    it('não deve retornar atendimentos inexistentes', async () => {
        const id = faker.string.uuid();
        atendimentosRepository.findById = jest.fn().mockResolvedValueOnce(null);

        await expect(atendimentosService.findById(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    it('deve atualizar um atendimento', async () => {
        const id = faker.string.uuid();
        const mock = AtendimentosMock();
        atendimentosRepository.update = jest.fn().mockResolvedValueOnce(mock);
        const result = await atendimentosService.update(id, {
            descricao: mock.descricao,
            unidadeId: mock.unidadeId,
            medicoId: mock.medicoId,
            gestacaoId: mock.gestacaoId,
            unidadeType: mock.unidadeType,
        });
        expect(result).toEqual(mock);
    });

    it('não deve permitir atualizar atendimentos inexistentes', async () => {
        const id = faker.string.uuid();
        const mock = AtendimentosMock();
        atendimentosRepository.update = jest
            .fn()
            .mockRejectedValueOnce(new Error());

        await expect(
            atendimentosService.update(id, {
                descricao: mock.descricao,
                unidadeId: mock.unidadeId,
                medicoId: mock.medicoId,
                gestacaoId: mock.gestacaoId,
                unidadeType: mock.unidadeType,
            }),
        ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('deve remover um atendimento existente', async () => {
        const id = faker.string.uuid();
        atendimentosRepository.delete = jest
            .fn()
            .mockResolvedValueOnce(undefined);
        await expect(atendimentosService.remove(id)).resolves.toBeUndefined();
    });

    it('não deve permitir deletar um atendimento com ID inexistente', async () => {
        const id = faker.string.uuid();
        atendimentosRepository.delete = jest
            .fn()
            .mockRejectedValueOnce(
                new NotFoundException('Atendimento não encontrado'),
            );

        await expect(atendimentosService.remove(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });
});
