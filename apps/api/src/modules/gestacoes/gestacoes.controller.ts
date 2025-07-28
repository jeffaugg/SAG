
// Importações dos módulos e tipos necessários para o controller de gestações
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


// Controller responsável pelas rotas relacionadas a gestações
@Controller('gestacoes')
export class GestacoesController {
  /**
   * Injeta o serviço de gestações necessário para as operações do controller
   */
  constructor(
      @Inject(GESTACOES_SERVICE)
      private readonly gestacaoService: IGestacaoService,
    ) {}

  /**
   * Cria uma nova gestação
   * Rota: POST /gestacoes
   */
  @Post()
  create(@Body() createGestacaoDto: CreateGestacaoDto) {
    return this.gestacaoService.create(createGestacaoDto);
  }

  /**
   * Lista todas as gestações (apenas para administradores, com paginação)
   * Rota: GET /gestacoes
   */
  @Get()
  @IsAdm()
  @IsPaginated()
  findAll(@Query() paginacaoDto: PaginacaoDto) {
    return this.gestacaoService.findAll(paginacaoDto);
  }

  /**
   * Busca uma gestação pelo ID
   * Rota: GET /gestacoes/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gestacaoService.findOne(id);
  }

  /**
   * Atualiza uma gestação pelo ID
   * Rota: PUT /gestacoes/:id
   */
  @Put(':id')
    update(
      @Param('id') id: string,
      @Body() UpdateGestacaoDto: UpdateGestacaoDto,
    ) {
      return this.gestacaoService.update(id, UpdateGestacaoDto);
    }

  /**
   * Remove uma gestação pelo ID
   * Rota: DELETE /gestacoes/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gestacaoService.remove(id);
  }
}
