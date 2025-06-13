import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message';
import { isPublic } from 'src/shared/decorators/isPublic';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { IMensagensService } from './interface/mensagens.service.interface';

@isPublic()
@Controller('mensagens')
export class MensagensController {
  constructor(
    @Inject(MENSAGENS_SERVICE)
    private readonly mensagensService: IMensagensService,
  ) {}

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    return this.mensagensService.create(dto);
  }
}
