// Importa decoradores de validação para as propriedades do DTO
import { IsUUID, IsNotEmpty, IsString } from 'class-validator';


/**
 * DTO para criação de um atendimento
 */
export class CreateAtendimentoDto {
    /**
     * ID da gestação relacionada ao atendimento (obrigatório, UUID)
     */
    @IsNotEmpty()
    @IsUUID()
    gestacaoId: string;

    /**
     * Descrição do atendimento (obrigatório, string)
     */
    @IsString()
    @IsNotEmpty()
    descricao: string;
}
