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
import { Cargo } from './dto/cargo.enum';
import { JwtPayload, OrganizacaoInfo } from 'src/shared/types';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: IUsuarioRepository,
        private jwtService: JwtService,
        private readonly sessionRepository: SessionRepository,
    ) {}
    async authenticate(authDto: AuthDto) {
        const usuario = await this.validateUsuario(authDto.cpf, authDto.senha);

        const orgInfo =
            usuario.cargo === Cargo.ADM
                ? undefined
                : await this.validateOrganizacao(
                      usuario.id,
                      authDto.organizacaoCNES,
                  );

        const token = await this.generateToken(usuario.id, orgInfo);
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

    private async generateToken(userId: string, organizacao?: OrganizacaoInfo) {
        const payload: JwtPayload = { userId: userId };
        if (organizacao) payload.organizacao = organizacao;
        return this.jwtService.signAsync(payload);
    }

    private async validateUsuario(cpf: string, senha: string) {
        const usuario = await this.usuarioRepo.findByCpf(cpf);

        if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

        const ok = await compare(senha, usuario.senha);
        if (!ok) throw new UnauthorizedException('Credenciais inválidas');

        return usuario;
    }

    private async validateOrganizacao(usuarioId: string, orgCNES: string) {
        const organizacao = await this.usuarioRepo.findOrganizacaoById(
            usuarioId,
            orgCNES,
        );

        if (!organizacao) {
            throw new UnauthorizedException('Organização não encontrada');
        }

        return { tipo: organizacao.tipo, cnes: orgCNES };
    }
}
