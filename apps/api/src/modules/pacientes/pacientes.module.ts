import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { PACIENTES_SERVICE } from 'src/common/constants';

@Module({
  controllers: [PacientesController],
  providers: [
    {
      provide: PACIENTES_SERVICE,
      useClass: PacientesService,
    },
  ],
})
export class PacientesModule {}
