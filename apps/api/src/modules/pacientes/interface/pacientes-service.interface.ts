import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Paciente } from '@prisma/client';

export interface IPacienteService {
  create(dto: CreatePacienteDto): Promise<Paciente>;
  findAll(options: PaginacaoDto): Promise<{ items: Paciente[]; total: number }>;
  findOne(id: string): Promise<Paciente>;
  update(id: string, dto: UpdatePacienteDto): Promise<Paciente>;
  remove(id: string): Promise<void>;
}
