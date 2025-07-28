// Importações dos módulos e tipos necessários do NestJS e do domínio de pacientes
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Inject,
    Query,
    Put,
} from '@nestjs/common';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { PACIENTES_SERVICE, GESTACOES_SERVICE } from 'src/common/constants';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { IPacienteService } from './interface/pacientes-service.interface';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IGestacaoService } from '../gestacoes/interface/gestacoes-service.interface';
import { organizationInfo } from 'src/shared/decorators/organizationInfo';
import { OrganizacaoInfo } from 'src/shared/types';


// Controller responsável pelas rotas relacionadas a pacientes
@Controller('pacientes')
export class PacientesController {
    /**
     * Injeta os serviços de pacientes e gestações necessários para as operações do controller
     */
    constructor(
        @Inject(PACIENTES_SERVICE)
        private readonly pacientesService: IPacienteService,
        @Inject(GESTACOES_SERVICE)
        private readonly gestacaoService: IGestacaoService,
    ) {}


    /**
     * Cria um novo paciente na organização informada
     * Rota: POST /pacientes
     */
    @Post()
    create(
        @Body() createPacienteDto: CreatePacienteDto,
        @organizationInfo() orgInfo: OrganizacaoInfo,
    ) {
        return this.pacientesService.create(createPacienteDto, orgInfo);
    }


    /**
     * Lista todos os pacientes (apenas para administradores, com paginação)
     * Rota: GET /pacientes
     */
    @Get()
    @IsPaginated()
    findAll(@Query() paginacaoDto: PaginacaoDto) {
        return this.pacientesService.findAll(paginacaoDto);
    }


    /**
     * Lista pacientes da organização do usuário (com paginação)
     * Rota: GET /pacientes/organizacao
     */
    @Get('organizacao')
    @IsPaginated()
    findAllByOrganization(
        @Query() paginacaoDto: PaginacaoDto,
        @organizationInfo() orgInfo: OrganizacaoInfo,
    ) {
        return this.pacientesService.findAllByOrganization(
            paginacaoDto,
            orgInfo,
        );
    }


    /**
     * Busca um paciente pelo ID
     * Rota: GET /pacientes/:id
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pacientesService.findOne(id);
    }


    /**
     * Atualiza os dados de um paciente pelo ID
     * Rota: PUT /pacientes/:id
     */
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updatePoliclinicaDto: UpdatePacienteDto,
    ) {
        return this.pacientesService.update(id, updatePoliclinicaDto);
    }


    /**
     * Remove um paciente pelo ID
     * Rota: DELETE /pacientes/:id
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pacientesService.remove(id);
    }


    /**
     * Associa um paciente a uma organização
     * Rota: POST /pacientes/:cpf/associar
     */
    @Post(':cpf/associar')
    associationOrganization(
        @Param('cpf') pacienteCpf: string,
        @organizationInfo() orgInfo: OrganizacaoInfo,
    ) {
        return this.pacientesService.association(pacienteCpf, orgInfo);
    }

    /**
     * Lista as gestações de um paciente (apenas para administradores, com paginação)
     * Rota: GET /pacientes/:id/gestacoes
     */
    @Get(':id/gestacoes')
    findByPaciente(@Param('id') id: string) {
        return this.gestacaoService.findByPaciente(id);
    }
}
