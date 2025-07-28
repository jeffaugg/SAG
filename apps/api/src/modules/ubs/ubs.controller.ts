// Importações dos módulos e tipos necessários do NestJS e do domínio de UBS
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    HttpCode,
    Inject,
} from '@nestjs/common';
import { CreateUbsDto } from './dto/create-ubs.dto';
import { UpdateUbsDto } from './dto/update-ubs.dto';
import { IsAdm } from 'src/shared/decorators/isAdm';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IUbsService } from './interface/ubs-service.interface';
import { UBS_SERVICE } from 'src/common/constants';
import { OrganizacaoInfo } from 'src/shared/types';
import { organizationInfo } from 'src/shared/decorators/organizationInfo';


// Controller responsável pelas rotas relacionadas a UBS (Unidades Básicas de Saúde)
@Controller('ubs')
export class UbsController {
    /**
     * Injeta o serviço de UBS necessário para as operações do controller
     */
    constructor(
        @Inject(UBS_SERVICE)
        private readonly ubsService: IUbsService,
    ) {}


    /**
     * Lista pacientes vinculados à UBS da organização informada (com paginação)
     * Rota: GET /ubs/pacientes
     */
    @Get('pacientes')
    @IsPaginated()
    listPatients(
        @Query() paginacaoDto: PaginacaoDto,
        @organizationInfo() orgInfo: OrganizacaoInfo,
    ) {
        return this.ubsService.listPatients(orgInfo, paginacaoDto);
    }


    /**
     * Busca paciente da UBS pelo CPF (com paginação)
     * Rota: GET /ubs/pacientes/cpf/:cpf
     */
    @Get('pacientes/cpf/:cpf')
    @IsPaginated()
    findPatientByCpf(
        @Param('cpf') pacienteCpf: string,
        @organizationInfo() orgInfo: OrganizacaoInfo,
    ) {
        return this.ubsService.getPatientByCpf(pacienteCpf, orgInfo);
    }


    /**
     * Cria uma nova UBS (apenas para administradores)
     * Rota: POST /ubs
     */
    @Post()
    @IsAdm()
    create(@Body() dto: CreateUbsDto) {
        return this.ubsService.create(dto);
    }


    /**
     * Lista todas as UBS (apenas para administradores, com paginação)
     * Rota: GET /ubs
     */
    @Get()
    @IsAdm()
    @IsPaginated()
    findAll(@Query() paginacaoDto: PaginacaoDto) {
        return this.ubsService.findAll(paginacaoDto);
    }


    /**
     * Busca uma UBS pelo ID (apenas para administradores)
     * Rota: GET /ubs/:id
     */
    @Get(':id')
    @IsAdm()
    findById(@Param('id') id: string) {
        return this.ubsService.findById(id);
    }


    /**
     * Atualiza uma UBS pelo ID (apenas para administradores)
     * Rota: PUT /ubs/:id
     */
    @Put(':id')
    @IsAdm()
    update(@Param('id') id: string, @Body() dto: UpdateUbsDto) {
        return this.ubsService.update(id, dto);
    }


    /**
     * Remove uma UBS pelo ID (apenas para administradores)
     * Rota: DELETE /ubs/:id
     */
    @Delete(':id')
    @IsAdm()
    @HttpCode(204)
    remove(@Param('id') id: string) {
        return this.ubsService.remove(id);
    }


    /**
     * Associa um usuário a uma UBS (apenas para administradores)
     * Rota: POST /ubs/:id/usuarios/:usuarioId
     */
    @Post(':id/usuarios/:usuarioId')
    @IsAdm()
    createUser(@Param('id') id: string, @Param('usuarioId') usuarioId: string) {
        return this.ubsService.createUser(usuarioId, id);
    }


    /**
     * Lista usuários vinculados a uma UBS pelo CNES (apenas para administradores, com paginação)
     * Rota: GET /ubs/:cnes/usuarios
     */
    @Get(':cnes/usuarios')
    @IsAdm()
    @IsPaginated()
    listUsers(
        @Param('cnes') cnes: string,
        @Query() paginacaoDto: PaginacaoDto,
    ) {
        return this.ubsService.listUsers(cnes, paginacaoDto);
    }
}
