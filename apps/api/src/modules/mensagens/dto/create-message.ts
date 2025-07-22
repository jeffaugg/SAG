import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMensagem } from '../entidade/tipo.mensagem';

class ConteudoDto {
  @IsNotEmpty({ message: 'O texto da mensagem não pode estar vazio' })
  @IsString({ message: 'O texto da mensagem deve ser uma string' })
  texto: string;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser uma string' })
  imagemUrl?: string;
}

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
