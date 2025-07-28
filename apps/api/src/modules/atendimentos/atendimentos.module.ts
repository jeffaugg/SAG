// Importa os módulos e tipos necessários do NestJS e do domínio de atendimentos
import { Module } from '@nestjs/common';
import { AtendimentosService } from './atendimentos.service';
import { AtendimentosRepository } from 'src/shared/database/repositories/atendimentos.repositories';
import { AtendimentosController } from './atendimentos.controller';
import {
    ATENDIMENTOS_SERVICE,
    ATENDIMENTOS_REPOSITORY,
} from 'src/common/constants';
import { S3Module } from 'src/shared/upload/s3.module';


// Módulo responsável por agrupar controller, providers e dependências de atendimentos
@Module({
    // Importa o módulo de S3 para upload/streaming de arquivos
    imports: [S3Module],
    // Define o controller responsável pelas rotas de atendimentos
    controllers: [AtendimentosController],
    // Define os providers que injetam as implementações dos serviços e repositórios de atendimentos
    providers: [
        { provide: ATENDIMENTOS_SERVICE, useClass: AtendimentosService },
        { provide: ATENDIMENTOS_REPOSITORY, useClass: AtendimentosRepository },
    ],
})
export class AtendimentosModule {}
