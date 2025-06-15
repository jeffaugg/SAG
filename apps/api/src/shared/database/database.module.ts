import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsuarioRepository } from './repositories/usuarios.repositories';
import { PoliclinicasRepository } from './repositories/policlinicas.repositories';
import {
    PACIENTES_REPOSITORY,
    POLICLINICAS_REPOSITORY,
    UBS_REPOSITORY,
    USUARIO_REPOSITORY,
} from 'src/common/constants';
import { PacienteRepository } from './repositories/pacientes.repositories';
import { UbsRepository } from './repositories/ubs.repositories';

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
            provide: UBS_REPOSITORY,
            useClass: UbsRepository,
        },
    ],
    exports: [
        PrismaService,
        USUARIO_REPOSITORY,
        POLICLINICAS_REPOSITORY,
        PACIENTES_REPOSITORY,
        UBS_REPOSITORY,
    ],
})
export class DatabaseModule {}
