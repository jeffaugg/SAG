import { Body, Controller, Inject, Post } from '@nestjs/common';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { IMensagensService } from './interface/mensagens.service.interface';

import { Get, Query, Param } from '@nestjs/common';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { CreateMessageDto } from './dto/create-message';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';

@Controller('mensagens')
export class MensagensController {
  constructor(
    @Inject(MENSAGENS_SERVICE)
    private readonly mensagensService: IMensagensService,
  ) {}

  @Post()
  async create(@Body() dto: CreateMessageDto, @activeUserId() userId: string) {
    return this.mensagensService.create(dto, userId);
  }

  @Get(':gestacaoId')
  @IsPaginated()
  async findByGestacao(
    @Param('gestacaoId') gestacaoId: string,
    @Query() paginacaoDto: PaginacaoDto,
  ) {
    const resultado = await this.mensagensService.findByGestacao(
      gestacaoId,
      paginacaoDto,
    );

    console.log('Resultado da busca paginada:', resultado); // ✅ ponto para log

    return resultado;
  }
}
