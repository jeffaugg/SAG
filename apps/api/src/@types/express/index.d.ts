import 'express';
import { OrganizacaoInfo } from 'src/shared/types';

declare global {
    namespace Express {
        interface Request {
            /** ID do usuário extraído do token JWT */
            userId: string;
            /** Informações da UBS/Policlinica que o usuário está logado */
            organizacaoInfo?: OrganizacaoInfo;
        }
    }
}
