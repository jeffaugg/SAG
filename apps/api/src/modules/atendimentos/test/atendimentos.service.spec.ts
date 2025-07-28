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


// Testes unitários para o serviço de atendimentos
describe('Atendimentos service', () => {
    let atendimentosService: IAtendimentosService;
    let atendimentosRepository: IAtendimentoRepository;

    // Setup do módulo de teste e injeção de dependências mockadas
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: ATENDIMENTOS_REPOSITORY,
                    useValue: {}, // Mock do repositório
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

    // Testa se o serviço foi definido corretamente
    it('deve ser definido', () => {
        expect(atendimentosService).toBeDefined();
    });

    // Mock de atendimento para uso nos testes
    const mock = AtendimentosMock();

    // Testa a criação de um atendimento com erro (deve lançar ConflictException)
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

    // Testa o retorno de todos os atendimentos
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

    // Testa o retorno de um atendimento por ID
    it('deve retornar um atendimento por ID', async () => {
        const id = faker.string.uuid();
        const mock = AtendimentosMock();
        atendimentosRepository.findById = jest.fn().mockResolvedValueOnce(mock);
        const result = await atendimentosService.findById(id);
        expect(result).toEqual(mock);
    });

    // Testa o caso de não encontrar atendimento por ID (deve lançar NotFoundException)
    it('não deve retornar atendimentos inexistentes', async () => {
        const id = faker.string.uuid();
        atendimentosRepository.findById = jest.fn().mockResolvedValueOnce(null);

        await expect(atendimentosService.findById(id)).rejects.toBeInstanceOf(
            NotFoundException,
        );
    });

    // Testa a atualização de um atendimento existente
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

    // Testa a tentativa de atualizar um atendimento inexistente (deve lançar InternalServerErrorException)
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

    // Testa a remoção de um atendimento existente
    it('deve remover um atendimento existente', async () => {
        const id = faker.string.uuid();
        atendimentosRepository.delete = jest
            .fn()
            .mockResolvedValueOnce(undefined);
        await expect(atendimentosService.remove(id)).resolves.toBeUndefined();
    });

    // Testa a tentativa de remover um atendimento inexistente (deve lançar NotFoundException)
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
