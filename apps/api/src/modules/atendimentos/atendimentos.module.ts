import { Module } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';
import { AtendimentosRepository } from 'src/shared/database/repositories/atendimentos.repositories';
import { AtendimentosController } from './atendimentos.controller';
import {
    ATENDIMENTOS_SERVICE,
    ATENDIMENTOS_REPOSITORY,
} from 'src/common/constants';

@Module({
    controllers: [AtendimentosController],
    providers: [
        { provide: ATENDIMENTOS_SERVICE, useClass: AtendimentosService },
        { provide: ATENDIMENTOS_REPOSITORY, useClass: AtendimentosRepository },
    ],
})
export class AtendimentosModule {}
