import { Global, Module } from '@nestjs/common';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { PoliclinicasModule } from './modules/policlinicas/policlinicas.module';
import { SessionModule } from './shared/cache/session.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { GestacoesModule } from './modules/gestacoes/gestacoes.module';
import { UbsModule } from './modules/ubs/ubs.module';
import { ChatGateway } from './modules/websocket/chat/chat.gateway';
import { AtendimentosModule } from './modules/atendimentos/atendimentos.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/shared/config/environments';
import { MensagensModule } from './modules/mensagens/mensagens.module';
import { S3Module } from './shared/upload/s3.module';

@Global()
@Module({
    imports: [
        UsuariosModule,
        DatabaseModule,
        AuthModule,
        PoliclinicasModule,
        SessionModule,
        PacientesModule,
        MongooseModule.forRoot(config.MONGO_URI),
        MensagensModule,
        GestacoesModule,
        UbsModule,
        AtendimentosModule,
        S3Module,
    ],
    controllers: [],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: AuthGuard,
        },
        ChatGateway,
    ],
})
export class AppModule {}
