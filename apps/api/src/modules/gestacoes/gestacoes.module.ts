import { Module } from '@nestjs/common';
import { GestacaoService } from './gestacoes.service';
import { GestacoesController } from './gestacoes.controller';
import { GESTACOES_SERVICE } from 'src/common/constants';

@Module({
  controllers: [GestacoesController],
  providers: [
    {
      provide: GESTACOES_SERVICE,
      useClass: GestacaoService,
    },
  ],
})
export class GestacoesModule {}
