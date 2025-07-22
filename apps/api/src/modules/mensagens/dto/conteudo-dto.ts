import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConteudoDto {
    @IsNotEmpty({ message: 'O texto da mensagem não pode estar vazio' })
    @IsString({ message: 'O texto da mensagem deve ser uma string' })
    texto: string;

    @IsOptional()
    @IsString({ message: 'A URL da imagem deve ser uma string' })
    imagemUrl?: string;
}
