
// Importa decoradores de validação, transformação e tipos para o DTO de criação de mensagem
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMensagem } from '../entidade/tipo.mensagem';
import { ConteudoDto } from './conteudo-dto';


/**
 * DTO para criação de uma mensagem
 */
export class CreateMessageDto {
    /**
     * ID da gestação relacionada à mensagem (obrigatório, string)
     */
    @IsNotEmpty({ message: 'A gestação é obrigatório' })
    @IsString({ message: 'A gestação deve ser uma string' })
    gestacao: string;

    /**
     * Tipo da mensagem (obrigatório, valor do enum TipoMensagem)
     */
    @IsNotEmpty({ message: 'O tipo da mensagem é obrigatório' })
    @IsEnum(TipoMensagem, { message: 'O tipo da mensagem é inválido' })
    tipo: TipoMensagem;

    /**
     * Conteúdo da mensagem (validação aninhada)
     */
    @ValidateNested()
    @Type(() => ConteudoDto)
    conteudo: ConteudoDto;
}
