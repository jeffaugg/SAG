// Importações dos módulos e tipos necessários do NestJS e do domínio de autenticação
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { isPublic } from 'src/shared/decorators/isPublic';
import { IAuthService } from './interface/auth-service.interface';
import { AUTH_SERVICE } from 'src/common/constants';


// Define o controller de autenticação, tornando suas rotas públicas (não requerem autenticação prévia)
@isPublic()
@Controller('auth')
export class AuthController {
    // Injeta a implementação do serviço de autenticação via token
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: IAuthService,
    ) {}


    // Rota POST /auth/login: recebe credenciais e retorna o resultado da autenticação
    @Post('login')
    authenticate(@Body() authDto: AuthDto) {
        return this.authService.authenticate(authDto);
    }

    // Rota POST /auth/register: recebe dados de cadastro e cria um novo usuário
    @Post('register')
    create(@Body() signupDto: SignupDto) {
        return this.authService.create(signupDto);
    }
}
