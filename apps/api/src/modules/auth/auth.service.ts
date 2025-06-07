import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { SessionRepository } from 'src/shared/cache/session.repositories';
import { IUsuarioRepository } from 'src/shared/database/repositories/interface/usuario-repository.interface';
import { USUARIO_REPOSITORY } from 'src/common/constants';
import { IAuthService } from './interface/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: IUsuarioRepository,
        private jwtService: JwtService,
        private readonly sessionRepository: SessionRepository,
    ) {}
    async authenticate(authDto: AuthDto) {
        const { cpf, senha } = authDto;
        const usuario = await this.usuarioRepo.findByCpf(cpf);

        if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

        const senhaValida = await compare(senha, usuario.senha);

        if (!senhaValida)
            throw new UnauthorizedException('Credenciais inválidas');

        const token = await this.generateToken(usuario.id);
        await this.sessionRepository.setUsuario(usuario, token);
        return { token };
    }

    async create(createUserDto: SignupDto) {
        const { nome, cargo, cpf, senha } = createUserDto;

        const cpfJaCadastrado = await this.usuarioRepo.findByCpf(cpf);

        if (cpfJaCadastrado) throw new ConflictException('CPF já cadastrado');

        const senhaHash = await hash(senha, 12);

        const usuario = await this.usuarioRepo.create({
            data: {
                nome,
                cargo,
                cpf,
                senha: senhaHash,
            },
        });

        const token = await this.generateToken(usuario.id);
        await this.sessionRepository.setUsuario(usuario, token);
        return { token };
    }

    private async generateToken(userId: string) {
        return this.jwtService.signAsync({ id: userId });
    }
}
