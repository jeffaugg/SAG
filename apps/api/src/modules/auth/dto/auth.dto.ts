import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(11, {
        message: 'cpf deve ter 11 caracteres',
    })
    @MaxLength(11, {
        message: 'cpf deve ter 11 caracteres',
    })
    cpf: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: 'senha deve ter pelo menos 8 caracteres',
    })
    senha: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    organizacaoCNES: string;
}
