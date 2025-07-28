import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { USUARIOS_SERVICE } from 'src/common/constants';

@Module({
    controllers: [UsuariosController],
    providers: [
        {
            provide: USUARIOS_SERVICE,
            useClass: UsuariosService,
        },
    ],
})
export class UsuariosModule {}
