// Importa módulos e tipos necessários para o módulo de gestações
import { Module } from '@nestjs/common';
import { GestacaoService } from './gestacoes.service';
import { GestacoesController } from './gestacoes.controller';
import { GESTACOES_SERVICE } from 'src/common/constants';

// Módulo responsável por agrupar controller e provider de gestações
@Module({
    // Define o controller responsável pelas rotas de gestações
    controllers: [GestacoesController],
    // Define o provider que injeta a implementação do serviço de gestações
    providers: [
        {
            provide: GESTACOES_SERVICE,
            useClass: GestacaoService,
        },
    ],
})
export class GestacoesModule {}
