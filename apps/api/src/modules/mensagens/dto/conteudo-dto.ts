
// Importa decoradores de validação para as propriedades do DTO de conteúdo de mensagem
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


/**
 * DTO para o conteúdo de uma mensagem
 */
export class ConteudoDto {
    /**
     * Texto da mensagem (obrigatório, string)
     */
    @IsNotEmpty({ message: 'O texto da mensagem não pode estar vazio' })
    @IsString({ message: 'O texto da mensagem deve ser uma string' })
    texto: string;

    /**
     * URL da imagem (opcional, string)
     */
    @IsOptional()
    @IsString({ message: 'A URL da imagem deve ser uma string' })
    imagemUrl?: string;
}
