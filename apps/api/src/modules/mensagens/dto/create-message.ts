import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'O corpo da mensagem não pode estar vazio' })
  @IsString({ message: 'O corpo da mensagem deve ser uma String' })
  mensagem: string;
}
