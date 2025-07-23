import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsUUID,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateGestacaoDto {
    @IsDateString()
    @IsNotEmpty()
    inicio: string;

    @IsOptional()
    @IsDateString()
    fim?: string;

    @IsEnum(Status)
    status: Status;

    @IsUUID()
    @IsNotEmpty()
    pacienteId: string;
}
