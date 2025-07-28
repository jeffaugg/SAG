// Importa utilitário para criar tipos parciais e o DTO base de criação
import { PartialType } from '@nestjs/mapped-types';
import { CreateGestacaoDto } from './create-gestacao.dto';

/**
 * DTO para atualização de gestação
 * Herda todos os campos do DTO de criação, tornando-os opcionais
 */
export class UpdateGestacaoDto extends PartialType(CreateGestacaoDto) {}
