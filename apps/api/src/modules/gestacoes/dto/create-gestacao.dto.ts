import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateGestacaoDto {
  @IsDateString()
  @IsNotEmpty()
  inicio: string;

  @IsDateString()
  fim?: string;

  @IsEnum(Status)
  status: Status;

  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;
}
