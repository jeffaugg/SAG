import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUbsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(256)
  localizacao: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  contato: string;

  @IsString()
  @IsNotEmpty()
  @Length(7, 7)
  cnes: string;
}
