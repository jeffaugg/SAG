
// Importa decoradores de validação e enum de status para o DTO de gestação
import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Status } from '@prisma/client';


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

    /**
     * Data de término da gestação (opcional, string ISO date)
     */
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
