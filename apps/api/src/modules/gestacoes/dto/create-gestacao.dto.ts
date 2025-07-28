import { Status } from '@prisma/client';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsUUID,
} from 'class-validator';

/**
 * DTO para criação de uma gestação
 */
export class CreateGestacaoDto {
    /**
     * Data de início da gestação (obrigatório, string ISO date)
     */
    @IsDateString()
    @IsNotEmpty()
    inicio: string;

    @IsOptional()
    @IsDateString()
    fim?: string;

    /**
     * Status da gestação (obrigatório, valor do enum Status)
     */
    @IsEnum(Status)
    status: Status;

    /**
     * ID do paciente relacionado à gestação (obrigatório, UUID)
     */
    @IsUUID()
    @IsNotEmpty()
    pacienteId: string;
}
