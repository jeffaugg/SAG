// Importa utilitário para criar tipos parciais e o DTO base de criação
import { PartialType } from '@nestjs/mapped-types';
import { CreateAtendimentoDto } from './create-atendimento.dto';

/**
 * DTO para atualização de atendimento
 * Herda todos os campos do DTO de criação, tornando-os opcionais
 */
export class UpdateAtendimentoDto extends PartialType(CreateAtendimentoDto) {}
