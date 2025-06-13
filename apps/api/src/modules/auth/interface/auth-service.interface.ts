import { AuthDto } from '../dto/auth.dto';
import { SignupDto } from '../dto/signup.dto';

export interface IAuthService {
    authenticate(authDto: AuthDto): Promise<{ token: string }>;
    create(signupDto: SignupDto): Promise<{ token: string }>;
}
