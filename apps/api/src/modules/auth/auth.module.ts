
// Importa módulos e tipos necessários para o módulo de autenticação
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/shared/config/environments';
import { DatabaseModule } from 'src/shared/database/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from 'src/common/constants';


// Módulo responsável por agrupar controller, provider e dependências de autenticação
@Module({
    // Importa o módulo de banco de dados e configura o módulo JWT globalmente
    imports: [
        DatabaseModule,
        JwtModule.register({
            global: true, // Torna o JWT disponível globalmente
            secret: config.JWT_SECRET, // Segredo para assinar tokens
            signOptions: { expiresIn: '7d' }, // Expiração padrão dos tokens
        }),
    ],
    // Define o controller responsável pelas rotas de autenticação
    controllers: [AuthController],
    // Define o provider que injeta a implementação do serviço de autenticação
    providers: [
        {
            provide: AUTH_SERVICE,
            useClass: AuthService,
        },
    ],
})
export class AuthModule {}
