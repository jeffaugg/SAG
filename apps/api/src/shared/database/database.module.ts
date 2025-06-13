import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsuarioRepository } from './repositories/usuarios.repositories';
import { PoliclinicasRepository } from './repositories/policlinicas.repositories';
import {
  GESTACOES_REPOSITORY,
  PACIENTES_REPOSITORY,
  POLICLINICAS_REPOSITORY,
  USUARIO_REPOSITORY,
} from 'src/common/constants';
import { GestacoesRepository } from './repositories/gestacoes.repositories';
import { PacienteRepository } from './repositories/pacientes.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioRepository,
    },
    {
      provide: POLICLINICAS_REPOSITORY,
      useClass: PoliclinicasRepository,
    },
    {
      provide: PACIENTES_REPOSITORY,
      useClass: PacienteRepository,
    },
    {
      provide: GESTACOES_REPOSITORY,
      useClass: GestacoesRepository,
    },
  ],
  exports: [
    PrismaService,
    USUARIO_REPOSITORY,
    POLICLINICAS_REPOSITORY,
    PACIENTES_REPOSITORY,
    GESTACOES_REPOSITORY,
  ],
})
export class DatabaseModule {}
