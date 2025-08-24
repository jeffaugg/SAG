import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TipoMensagem } from '../entidade/tipo.mensagem';

export class CreateMessageWithFileDto {
    @IsNotEmpty({ message: 'A gestação é obrigatório' })
    @IsString({ message: 'A gestação deve ser uma string' })
    gestacao: string;

    @IsNotEmpty({ message: 'O tipo da mensagem é obrigatório' })
    @IsEnum(TipoMensagem, { message: 'O tipo da mensagem é inválido' })
    tipo: TipoMensagem;

    @IsOptional()
    @IsString({ message: 'O texto da mensagem deve ser uma string' })
    texto?: string;
}
