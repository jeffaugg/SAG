import 'express';

declare global {
    namespace Express {
        interface Request {
            /** ID do usuário extraído do token JWT */
            userId: string;
        }
    }
}
