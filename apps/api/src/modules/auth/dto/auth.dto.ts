// Importa decoradores de validação para as propriedades do DTO de autenticação
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';


/**
 * DTO para autenticação de usuário
 */
export class AuthDto {
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

    /**
     * CNES da organização (opcional, mas decorado como obrigatório para compatibilidade)
     */
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    organizacaoCNES: string;
}
