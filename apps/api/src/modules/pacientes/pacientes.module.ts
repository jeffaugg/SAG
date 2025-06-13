import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { GESTACOES_SERVICE, PACIENTES_SERVICE } from 'src/common/constants';
import { GestacaoService } from '../gestacoes/gestacoes.service';

@Module({
  controllers: [PacientesController],
  providers: [
    {
      provide: PACIENTES_SERVICE,
      useClass: PacientesService,
    },
    {
      provide: GESTACOES_SERVICE,
      useClass: GestacaoService,
    },
  ],
})
export class PacientesModule {}
