import { Global, Module } from '@nestjs/common';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { PoliclinicasModule } from './modules/policlinicas/policlinicas.module';
import { SessionModule } from './shared/cache/session.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { UbsModule } from './modules/ubs/ubs.module';
import { ChatGateway } from './modules/websocket/chat/chat.gateway';

@Global()
@Module({
  imports: [
    UsuariosModule,
    DatabaseModule,
    AuthModule,
    PoliclinicasModule,
    SessionModule,
    PacientesModule,
    UbsModule,
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
