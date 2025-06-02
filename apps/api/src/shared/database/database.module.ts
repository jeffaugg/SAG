import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsuarioRepository } from './repositories/usuarios.repositories';
import { PoliclinicasRepository } from './repositories/policlinicas.repositories';
import {
  POLICLINICAS_REPOSITORY,
  USUARIO_REPOSITORY,
} from 'src/common/constants';

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
  ],
  exports: [PrismaService, USUARIO_REPOSITORY, POLICLINICAS_REPOSITORY],
})
export class DatabaseModule {}
