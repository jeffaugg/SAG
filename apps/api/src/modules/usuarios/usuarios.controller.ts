import { Controller, Get, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import { IUsuariosService } from './interface/usuario-service.interface';
import { USUARIOS_SERVICE } from 'src/common/constants';

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
}
