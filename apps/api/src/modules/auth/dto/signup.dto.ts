import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Cargo } from './cargo.enum';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(Cargo, { message: 'cargo precisa ser Enfermeiro, Medico ou ADM' })
    cargo: Cargo;

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
}
