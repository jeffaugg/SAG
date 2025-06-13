import { Global, Module } from '@nestjs/common';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { PoliclinicasModule } from './modules/policlinicas/policlinicas.module';
import { SessionModule } from './shared/cache/session.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { ChatGateway } from './modules/websocket/chat/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/shared/config/environments';
import { MensagensModule } from './modules/mensagens/mensagens.module';

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
