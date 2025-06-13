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
import { GESTACOES_SERVICE } from 'src/common/constants';
import { CreateGestacaoDto } from './dto/create-gestacao.dto';
import { UpdateGestacaoDto } from './dto/update-gestacao.dto';
import { IGestacaoService } from './interface/gestacoes-service.interface';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';

@Controller('gestacoes')
export class GestacoesController {
  constructor(
      @Inject(GESTACOES_SERVICE)
      private readonly gestacaoService: IGestacaoService,
    ) {}

  @Post()
  create(@Body() createGestacaoDto: CreateGestacaoDto) {
    return this.gestacaoService.create(createGestacaoDto);
  }

  @Get()
  @IsAdm()
  @IsPaginated()
  findAll(@Query() paginacaoDto: PaginacaoDto) {
    return this.gestacaoService.findAll(paginacaoDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gestacaoService.findOne(id);
  }

  @Put(':id')
    update(
      @Param('id') id: string,
      @Body() UpdateGestacaoDto: UpdateGestacaoDto,
    ) {
      return this.gestacaoService.update(id, UpdateGestacaoDto);
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gestacaoService.remove(id);
  }
}
