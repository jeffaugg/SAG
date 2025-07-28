import { Body, Controller, Inject, Post } from '@nestjs/common';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { IMensagensService } from './interface/mensagens.service.interface';

import { Get, Query, Param } from '@nestjs/common';
import { IsPaginated } from 'src/shared/decorators/Ispaginated';
import { CreateMessageDto } from './dto/create-message';
import { activeUserId } from 'src/shared/decorators/activeUserId';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';


/**
 * Controller responsável pelo gerenciamento das mensagens.
 * Define as rotas para criação e busca de mensagens relacionadas a uma gestação.
 */
@Controller('mensagens')
export class MensagensController {
  /**
   * Injeta o serviço de mensagens via token de provider.
   */
  constructor(
    @Inject(MENSAGENS_SERVICE)
    private readonly mensagensService: IMensagensService,
  ) {}

  /**
   * Cria uma nova mensagem.
   * @param dto Dados da mensagem a ser criada (validados pelo DTO)
   * @param userId ID do usuário remetente (extraído do contexto do usuário ativo)
   * @returns Mensagem criada
   */
  @Post()
  async create(@Body() dto: CreateMessageDto, @activeUserId() userId: string) {
    return this.mensagensService.create(dto, userId);
  }

  /**
   * Busca mensagens paginadas de uma gestação específica.
   * @param gestacaoId ID da gestação
   * @param paginacaoDto Parâmetros de paginação
   * @returns Lista paginada de mensagens
   */
  @Get(':gestacaoId')
  @IsPaginated() // Decorator customizado para habilitar paginação automática
  async findByGestacao(
    @Param('gestacaoId') gestacaoId: string,
    @Query() paginacaoDto: PaginacaoDto,
  ) {
    const resultado = await this.mensagensService.findByGestacao(
      gestacaoId,
      paginacaoDto,
    );

    // Loga o resultado da busca paginada (útil para debug)
    console.log('Resultado da busca paginada:', resultado); // ✅ ponto para log

    return resultado;
  }
}
