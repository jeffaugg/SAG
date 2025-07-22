import { PartialType } from '@nestjs/mapped-types';
import { CreateAtendimentoDto } from './create-atendimento.dto';

export class UpdateAtendimentoDto extends PartialType(CreateAtendimentoDto) {}
