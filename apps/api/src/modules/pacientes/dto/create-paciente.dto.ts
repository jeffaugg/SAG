import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';

export class CreatePacienteDto {
    @IsNotEmpty({ message: 'O nome não pode estar vazio' })
    @IsString({ message: 'O nome deve ser uma String' })
    @MaxLength(256, {
        message: 'O nome deve ter no máximo 256 caracteres.',
    })
    nome: string;

    @IsNotEmpty({ message: 'O CPF não pode estar vazio' })
    @IsString({ message: 'O CPF deve ser uma String' })
    @Length(11, 11, { message: 'CPF deve conter exatamente 11 dígitos' })
    cpf: string;

    @IsOptional()
    @IsString({ message: 'O telefone deve ser uma String' })
    telefone?: string;

    @IsOptional()
    @IsString({ message: 'O endereco deve ser uma String' })
    endereco?: string;
}
