import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { IMensagensService } from './interface/mensagens.service.interface';
import { activeUserId } from 'src/shared/decorators/activeUserId';

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
}
