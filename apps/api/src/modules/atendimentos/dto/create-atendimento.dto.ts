import { UnidadeType } from '@prisma/client';
import { IsUUID, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateAtendimentoDto {
    @IsNotEmpty()
    @IsUUID()
    unidadeId: string;

    @IsNotEmpty()
    @IsEnum(UnidadeType)
    unidadeType: UnidadeType;

    @IsNotEmpty()
    @IsUUID()
    medicoId: string;

    @IsNotEmpty()
    @IsUUID()
    gestacaoId: string;

    @IsString()
    @IsNotEmpty()
    descricao: string;
}
