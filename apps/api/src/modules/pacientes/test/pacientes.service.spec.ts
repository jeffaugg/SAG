import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from '../pacientes.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
    PACIENTES_REPOSITORY,
    ASSOCIACAO_STRATEGIES,
} from 'src/common/constants';
import { IPacientesRepository } from 'src/shared/database/repositories/interface/pacientes-repository.interface';
import { IAssociacaoStrategy } from '../strategies/interface/associacao-strategy.interface';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { OrganizacaoInfo } from 'src/shared/types';
import { Paciente } from '@prisma/client';

describe('PacientesService', () => {
    let pacientesService: PacientesService;
    let pacientesRepository: jest.Mocked<IPacientesRepository>;
    const pacientesRepositoryMock: jest.Mocked<IPacientesRepository> = {
        create: jest.fn(),
        findByCpf: jest.fn(),
        findAll: jest.fn(),
        findAllByOrganization: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    let associacaoStrategies: Map<string, IAssociacaoStrategy>;
    const now = new Date();

    const orgInfo: OrganizacaoInfo = {
        tipo: 'policlinica',
        cnes: '123456',
    };

    const strategyMock = {
        association: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<Pick<IAssociacaoStrategy, 'association'>>;

    beforeAll(async () => {
        associacaoStrategies = new Map<string, IAssociacaoStrategy>();
        associacaoStrategies.set('policlinica', strategyMock);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: PACIENTES_REPOSITORY,
                    useValue: pacientesRepositoryMock,
                },
                {
                    provide: ASSOCIACAO_STRATEGIES,
                    useValue: associacaoStrategies,
                },
                PacientesService,
            ],
        }).compile();

        pacientesService = module.get(PacientesService);
        pacientesRepository = pacientesRepositoryMock;
    });

    it('criar paciente sem endereço e sem telefone corretamente', async () => {
        const dto: CreatePacienteDto = {
            nome: 'João',
            cpf: '11111111111',
        };

        const pacienteFake: Paciente = {
            id: '1',
            nome: dto.nome,
            cpf: dto.cpf,
            telefone: null,
            endereco: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        (pacientesRepository.create as jest.Mock).mockResolvedValueOnce(
            pacienteFake,
        );
        (strategyMock.association as jest.Mock).mockResolvedValueOnce(
            undefined,
        );

        const result = await pacientesService.create(dto, orgInfo);

        expect(result).toEqual(pacienteFake);
        expect(strategyMock.association).toHaveBeenCalledWith(
            pacienteFake,
            orgInfo,
        );
    });

    it('criar paciente com endereço e telefone corretamente', async () => {
        const dto: CreatePacienteDto = {
            nome: 'Maria',
            cpf: '22222222222',
            endereco: 'Rua A 123 Fortaleza CE',
            telefone: '85999990000',
        };

        const pacienteFake: Paciente = {
            id: '2',
            nome: dto.nome,
            cpf: dto.cpf,
            telefone: dto.telefone ?? null,
            endereco: dto.endereco ?? null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        (pacientesRepository.create as jest.Mock).mockResolvedValueOnce(
            pacienteFake,
        );
        (strategyMock.association as jest.Mock).mockResolvedValueOnce(
            undefined,
        );

        const result = await pacientesService.create(dto, orgInfo);

        expect(result).toEqual(pacienteFake);
        expect(strategyMock.association).toHaveBeenCalledWith(
            pacienteFake,
            orgInfo,
        );
    });

    it('criar paciente erro em paciente já existe e estrategia não implementada', async () => {
        const dto: CreatePacienteDto = {
            nome: 'José',
            cpf: '33333333333',
        };

        (pacientesRepository.create as jest.Mock).mockRejectedValueOnce(
            new Error('Duplicado'),
        );
        await expect(pacientesService.create(dto, orgInfo)).rejects.toThrow(
            ConflictException,
        );

        const pacienteFake: Paciente = {
            id: '3',
            nome: dto.nome,
            cpf: dto.cpf,
            telefone: null,
            endereco: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        const emptyMap = new Map();

        (pacientesRepository.create as jest.Mock).mockResolvedValueOnce(
            pacienteFake,
        );

        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: PACIENTES_REPOSITORY,
                    useValue: pacientesRepository,
                },
                {
                    provide: ASSOCIACAO_STRATEGIES,
                    useValue: emptyMap,
                },
                PacientesService,
            ],
        }).compile();

        const localService = module.get(PacientesService);
        await expect(localService.create(dto, orgInfo)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('associar corretamente com paciente e organização', async () => {
        const paciente: Paciente = {
            id: '4',
            nome: 'Ana',
            cpf: '44444444444',
            telefone: null,
            endereco: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        (pacientesRepository.findByCpf as jest.Mock).mockResolvedValueOnce(
            paciente,
        );
        (strategyMock.association as jest.Mock).mockResolvedValueOnce(
            undefined,
        );

        await pacientesService.association(paciente.cpf, orgInfo);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(pacientesRepository.findByCpf).toHaveBeenCalledWith(
            paciente.cpf,
        );
        expect(strategyMock.association).toHaveBeenCalledWith(
            paciente,
            orgInfo,
        );
    });

    it('associar erro, paciente não existe e a organização não existe', async () => {
        (pacientesRepository.findByCpf as jest.Mock).mockResolvedValueOnce(
            null,
        );

        await expect(
            pacientesService.association('00000000000', orgInfo),
        ).rejects.toThrow(NotFoundException);

        const paciente: Paciente = {
            id: '5',
            nome: 'Carlos',
            cpf: '55555555555',
            telefone: null,
            endereco: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        (pacientesRepository.findByCpf as jest.Mock).mockResolvedValueOnce(
            paciente,
        );

        const emptyMap = new Map();

        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: PACIENTES_REPOSITORY,
                    useValue: pacientesRepository,
                },
                {
                    provide: ASSOCIACAO_STRATEGIES,
                    useValue: emptyMap,
                },
                PacientesService,
            ],
        }).compile();

        const localService = module.get(PacientesService);
        await expect(
            localService.association(paciente.cpf, orgInfo),
        ).rejects.toThrow(NotFoundException);
    });
});
