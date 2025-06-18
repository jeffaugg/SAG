import { Controller, Get, Inject, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import { IUsuariosService } from './interface/usuario-service.interface';
import { USUARIOS_SERVICE } from 'src/common/constants';
import { isPublic } from 'src/shared/decorators/isPublic';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        @Inject(USUARIOS_SERVICE)
        private readonly usersService: IUsuariosService,
    ) {}

    @Get('/me')
    async me(@Req() request: Request, @activeUserId() userId: string) {
        return await this.usersService.getUsuariosById(userId);
    }

    @Get('/:cpf/organizacao')
    @isPublic()
    async meOrganizacao(@Param('cpf') pacienteCpf: string) {
        return this.usersService.getOrganizacaoByUserId(pacienteCpf);
    }
}
