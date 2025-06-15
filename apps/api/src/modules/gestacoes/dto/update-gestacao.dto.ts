import { PartialType } from '@nestjs/mapped-types';
import { CreateGestacaoDto } from './create-gestacao.dto';

export class UpdateGestacaoDto extends PartialType(CreateGestacaoDto) {}
