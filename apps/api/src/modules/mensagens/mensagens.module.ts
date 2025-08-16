// Importações dos módulos e serviços necessários para o módulo de mensagens
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { DatabaseModule } from 'src/shared/database/database.module';
import { Mensagem, MensagemSchema } from './mensagem';
import { MensagensController } from './mensagens.controller';
import { MensagensService } from './mensagens.service';

/**
 * Módulo responsável por agrupar as dependências, controllers e providers relacionados às mensagens.
 */
@Module({
    // Importa o módulo do Mongoose já configurado para a entidade Mensagem
    imports: [
        MongooseModule.forFeature([
            { name: Mensagem.name, schema: MensagemSchema },
        ]),
        DatabaseModule,
    ],
    // Define o controller responsável pelas rotas de mensagens
    controllers: [MensagensController],
    // Define o provider do serviço de mensagens, usando injeção de dependência por token
    providers: [
        {
            provide: MENSAGENS_SERVICE,
            useClass: MensagensService,
        },
    ],
    // Exporta o serviço para ser utilizado em outros módulos
    exports: [MENSAGENS_SERVICE],
})
export class MensagensModule {}
