import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { PACIENTES_SERVICE, PACIENTES_REPOSITORY } from 'src/common/constants';
import { PacienteRepository } from 'src/shared/database/repositories/pacientes.repositories';

@Module({
  controllers: [PacientesController],
  providers: [
    {
      provide: PACIENTES_SERVICE,
      useClass: PacientesService,
    },
    {
      provide: PACIENTES_REPOSITORY,
      useClass: PacienteRepository,
    },
  ],
})
export class PacientesModule {}
