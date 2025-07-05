import { Module } from '@nestjs/common';
import { MensagensService } from './mensagens.service';
import { MensagensController } from './mensagens.controller';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { Mensagem, MensagemSchema } from './mensagem';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mensagem.name, schema: MensagemSchema },
    ]),
  ],
  controllers: [MensagensController],
  providers: [
    {
      provide: MENSAGENS_SERVICE,
      useClass: MensagensService,
    },
  ],
})
export class MensagensModule {}
