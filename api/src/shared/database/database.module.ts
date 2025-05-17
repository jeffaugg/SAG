// src/shared/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsuarioRepository } from './repositories/usuarios.repositories';

@Global()
@Module({
  providers: [PrismaService, UsuarioRepository],
  exports: [UsuarioRepository],
})
export class DatabaseModule {}
