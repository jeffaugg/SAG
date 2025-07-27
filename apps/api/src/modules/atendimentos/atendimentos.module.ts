import { Module } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';
import { AtendimentosRepository } from 'src/shared/database/repositories/atendimentos.repositories';
import { AtendimentosController } from './atendimentos.controller';
import {
    ATENDIMENTOS_SERVICE,
    ATENDIMENTOS_REPOSITORY,
} from 'src/common/constants';
import { S3Module } from 'src/shared/upload/s3.module';

@Module({
    imports: [S3Module],
    controllers: [AtendimentosController],
    providers: [
        { provide: ATENDIMENTOS_SERVICE, useClass: AtendimentosService },
        { provide: ATENDIMENTOS_REPOSITORY, useClass: AtendimentosRepository },
    ],
})
export class AtendimentosModule {}
