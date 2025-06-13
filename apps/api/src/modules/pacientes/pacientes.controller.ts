/* eslint-disable prettier/prettier */
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
import { IsAdm } from 'src/shared/decorators/isAdm';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { PACIENTES_SERVICE, GESTACOES_SERVICE } from 'src/common/constants';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { IPacienteService } from './interface/pacientes-service.interface';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { IGestacaoService } from '../gestacoes/interface/gestacoes-service.interface';

@Controller('pacientes')
export class PacientesController {
  constructor(
      @Inject(PACIENTES_SERVICE)
      private readonly pacientesService: IPacienteService,
      @Inject(GESTACOES_SERVICE)
        private readonly gestacaoService: IGestacaoService,
    ) {}

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  @IsAdm()
  @IsPaginated()
  findAll(@Query() paginacaoDto: PaginacaoDto) {
    return this.pacientesService.findAll(paginacaoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }

  @Put(':id')
    update(
      @Param('id') id: string,
      @Body() updatePoliclinicaDto: UpdatePacienteDto,
    ) {
      return this.pacientesService.update(id, updatePoliclinicaDto);
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(id);
  }

  @Get(':id/gestacoes')
  @IsAdm()
  @IsPaginated()
  findByPaciente(@Param('id') id: string, @Query() paginacaoDto: PaginacaoDto) {
    return this.gestacaoService.findByPaciente(id, paginacaoDto);
  }

}
