import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePoliclinicaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256, {
    message: 'O nome deve ter no máximo 256 caracteres.',
  })
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'A localização deve ter ao menos 5 caracteres.' })
  @MaxLength(256, {
    message: 'A localização deve ter no máximo 256 caracteres.',
  })
  localizacao: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR', {
    message: 'O telefone deve ser um número de telefone válido.',
  })
  contato: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 7, {
    message: 'O cnes deve ter exatamente 7 caracteres.',
  })
  cnes: string;
}
