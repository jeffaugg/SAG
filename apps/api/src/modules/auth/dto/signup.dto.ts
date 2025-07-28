
// Importa decoradores de validação e enum de cargos para o DTO de cadastro
import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Cargo } from './cargo.enum';


/**
 * DTO para cadastro de novo usuário
 */
export class SignupDto {
    /**
     * Nome do usuário (obrigatório)
     */
    @IsString()
    @IsNotEmpty()
    nome: string;

    /**
     * Cargo do usuário (obrigatório, deve ser um valor do enum Cargo)
     */
    @IsString()
    @IsNotEmpty()
    @IsEnum(Cargo, { message: 'cargo precisa ser Enfermeiro, Medico ou ADM' })
    cargo: Cargo;

    /**
     * CPF do usuário (obrigatório, 11 caracteres)
     */
    @IsString()
    @IsNotEmpty()
    @MinLength(11, {
        message: 'cpf deve ter 11 caracteres',
    })
    @MaxLength(11, {
        message: 'cpf deve ter 11 caracteres',
    })
    cpf: string;

    /**
     * Senha do usuário (obrigatório, mínimo 8 caracteres)
     */
    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: 'senha deve ter pelo menos 8 caracteres',
    })
    senha: string;
}
