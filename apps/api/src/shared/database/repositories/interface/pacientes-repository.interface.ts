import { CreatePacienteDto } from 'src/modules/pacientes/dto/create-paciente.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Paciente } from '@prisma/client';
import { UpdatePacienteDto } from 'src/modules/pacientes/dto/update-paciente.dto';

export interface IPacientesRepository {
  create(dto: CreatePacienteDto): Promise<Paciente>;
  findAll(pagination: PaginacaoDto): Promise<{
    items: Paciente[];
    total: number;
  }>;
  findById(id: string): Promise<Paciente | null>;
  update(id: string, data: UpdatePacienteDto): Promise<Paciente>;
  delete(id: string): Promise<Paciente>;
}
