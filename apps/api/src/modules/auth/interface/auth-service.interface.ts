
// Importa os DTOs utilizados nos métodos de autenticação
import { AuthDto } from '../dto/auth.dto';
import { SignupDto } from '../dto/signup.dto';


/**
 * Interface que define o contrato do serviço de autenticação
 */
export interface IAuthService {
    /**
     * Autentica um usuário e retorna um token JWT
     * @param authDto Dados de autenticação (cpf, senha, organização)
     */
    authenticate(authDto: AuthDto): Promise<{ token: string }>;

    /**
     * Cria um novo usuário e retorna um token JWT
     * @param signupDto Dados de cadastro do usuário
     */
    create(signupDto: SignupDto): Promise<{ token: string }>;
}
