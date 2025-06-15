import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import {
    PACIENTES_SERVICE,
    PACIENTES_REPOSITORY,
    ASSOCIACAO_STRATEGIES,
} from 'src/common/constants';
import { PacienteRepository } from 'src/shared/database/repositories/pacientes.repositories';
import { PrismaService } from 'src/shared/database/prisma.service';
import { AssociacaoPoliclinicaStrategy } from './strategies/associacao-policlinica.strategy';
import { AssociacaoUbsStrategy } from './strategies/associacao-ubs.strategy';

@Module({
    controllers: [PacientesController],
    providers: [
        AssociacaoPoliclinicaStrategy,
        AssociacaoUbsStrategy,
        PrismaService,
        {
            provide: PACIENTES_SERVICE,
            useClass: PacientesService,
        },
        {
            provide: PACIENTES_REPOSITORY,
            useClass: PacienteRepository,
        },
        {
            provide: ASSOCIACAO_STRATEGIES,
            useFactory: (
                pol: AssociacaoPoliclinicaStrategy,
                ubs: AssociacaoUbsStrategy,
            ) =>
                new Map<string, any>([
                    ['policlinica', pol],
                    ['ubs', ubs],
                ]),
            inject: [AssociacaoPoliclinicaStrategy, AssociacaoUbsStrategy],
        },
    ],
})
export class PacientesModule {}
