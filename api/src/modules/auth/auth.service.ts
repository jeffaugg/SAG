import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from 'src/shared/database/repositories/usuarios.repositories';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioRepo: UsuarioRepository,
    private jwtService: JwtService,
  ) {}
  async authenticate(authDto: AuthDto) {
    const { cpf, senha } = authDto;
    const usuario = await this.usuarioRepo.findByCpf(cpf);

    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

    const senhaValida = await compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = await this.generateToken(usuario.id);

    return { token };
  }

  async create(createUserDto: SignupDto) {
    const { nome, cargo, cpf, senha } = createUserDto;

    const cpfJaCadastrado = await this.usuarioRepo.findByCpf(cpf);

    if (cpfJaCadastrado) {
      throw new ConflictException('CPF já cadastrado');
    }

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

    return { token };
  }

  private async generateToken(userId: string) {
    return this.jwtService.signAsync({ id: userId });
  }
}
