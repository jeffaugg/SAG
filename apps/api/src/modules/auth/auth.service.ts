// Importações de módulos, tipos e utilitários necessários para autenticação
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


// Serviço responsável pela lógica de autenticação e cadastro de usuários
@Injectable()
export class AuthService implements IAuthService {
    // Injeta dependências necessárias: repositório de usuários, serviço JWT e repositório de sessão
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly usuarioRepo: IUsuarioRepository,
        private jwtService: JwtService,
        private readonly sessionRepository: SessionRepository,
    ) {}

    /**
     * Autentica um usuário a partir do DTO recebido.
     * Valida o usuário, verifica organização (se necessário), gera token e armazena sessão.
     */
    async authenticate(authDto: AuthDto) {
        const usuario = await this.validateUsuario(authDto.cpf, authDto.senha);

        // Se não for administrador, valida a organização informada
        const orgInfo =
            usuario.cargo === Cargo.ADM
                ? undefined
                : await this.validateOrganizacao(
                      usuario.id,
                      authDto.organizacaoCNES,
                  );

        // Gera token JWT e armazena sessão
        const token = await this.generateToken(usuario.id, orgInfo);
        await this.sessionRepository.setUsuario(usuario, token);
        return { token };
    }


    /**
     * Cria um novo usuário a partir do DTO recebido.
     * Verifica duplicidade de CPF, faz hash da senha, cria usuário e retorna token.
     */
    async create(createUserDto: SignupDto) {
        const { nome, cargo, cpf, senha } = createUserDto;

        // Verifica se o CPF já está cadastrado
        const cpfJaCadastrado = await this.usuarioRepo.findByCpf(cpf);
        if (cpfJaCadastrado) throw new ConflictException('CPF já cadastrado');

        // Gera hash da senha
        const senhaHash = await hash(senha, 12);

        // Cria usuário no banco
        const usuario = await this.usuarioRepo.create({
            data: {
                nome,
                cargo,
                cpf,
                senha: senhaHash,
            },
        });

        // Gera token JWT e armazena sessão
        const token = await this.generateToken(usuario.id);
        await this.sessionRepository.setUsuario(usuario, token);
        return { token };
    }


    /**
     * Gera um token JWT para o usuário, incluindo informações de organização se houver.
     */
    private async generateToken(userId: string, organizacao?: OrganizacaoInfo) {
        const payload: JwtPayload = { userId: userId };
        if (organizacao) payload.organizacao = organizacao;
        return this.jwtService.signAsync(payload);
    }


    /**
     * Valida o usuário pelo CPF e senha.
     * Lança exceção se não encontrar ou se a senha estiver incorreta.
     */
    private async validateUsuario(cpf: string, senha: string) {
        const usuario = await this.usuarioRepo.findByCpf(cpf);

        if (!usuario) throw new UnauthorizedException('Credenciais inválidas');
        if (usuario.deletedAt)
            throw new UnauthorizedException('Credenciais inválidas');

        // Compara senha informada com hash salvo
        const ok = await compare(senha, usuario.senha);
        if (!ok) throw new UnauthorizedException('Credenciais inválidas');

        return usuario;
    }

    /**
     * Valida se o usuário pertence à organização informada (exceto para administradores).
     * Lança exceção se não encontrar a organização.
     */
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
