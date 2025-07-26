import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class CreateAtendimentoDto {
    @IsNotEmpty()
    @IsUUID()
    gestacaoId: string;

    @IsString()
    @IsNotEmpty()
    descricao: string;
}
