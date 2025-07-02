import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Query,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import { IUsuariosService } from './interface/usuario-service.interface';
import { USUARIOS_SERVICE } from 'src/common/constants';
import { isPublic } from 'src/shared/decorators/isPublic';
import { IsAdm } from 'src/shared/decorators/isAdm';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { FilterUsuariosDto } from './dto/filter-usuarios.dto';

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

    @IsAdm()
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        return await this.usersService.delete(id);
    }

    @IsAdm()
    @Get()
    @IsPaginated()
    async findAll(@Query() filter: FilterUsuariosDto) {
        return await this.usersService.listAllUsuarios(filter);
    }

    @IsAdm()
    @Patch('/:id')
    async update(
        @Param('id') id: string,
        @Body() updateUsuariosDto: UpdateUsuariosDto,
    ) {
        return await this.usersService.update(id, updateUsuariosDto);
    }
}
