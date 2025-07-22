import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMensagem } from '../entidade/tipo.mensagem';
import { ConteudoDto } from './conteudo-dto';

export class CreateMessageDto {
    @IsNotEmpty({ message: 'A gestação é obrigatório' })
    @IsString({ message: 'A gestação deve ser uma string' })
    gestacao: string;

    @IsNotEmpty({ message: 'O tipo da mensagem é obrigatório' })
    @IsEnum(TipoMensagem, { message: 'O tipo da mensagem é inválido' })
    tipo: TipoMensagem;

    @ValidateNested()
    @Type(() => ConteudoDto)
    conteudo: ConteudoDto;
}
