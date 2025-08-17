// Importa decoradores de validação para as propriedades do DTO de conteúdo de mensagem
import { IsOptional, IsString } from 'class-validator';

/**
 * DTO para o conteúdo de uma mensagem
 */
export class ConteudoDto {
    /**
     * Texto da mensagem (opcional, string)
     */
    @IsOptional()
    @IsString({ message: 'O texto da mensagem deve ser uma string' })
    texto?: string;

    /**
     * URL da imagem (opcional, string)
     */
    @IsOptional()
    @IsString({ message: 'A URL da imagem deve ser uma string' })
    imagemUrl?: string;

    /**
     * URL do arquivo (opcional, string)
     */
    @IsOptional()
    @IsString({ message: 'A URL do arquivo deve ser uma string' })
    arquivoUrl?: string;
}
