// Importações dos módulos e tipos necessários para o guard de autenticação
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/isPublic';
import { IS_ADM_KEY } from 'src/shared/decorators/isAdm';
import { SessionRepository } from 'src/shared/cache/session.repositories';
import { JwtPayload } from 'src/shared/types';

/**
 * Guard responsável por autenticar e autorizar requisições usando JWT
 */
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * Injeta serviços necessários: JWT, Reflector e SessionRepository
     */
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly sessionRepository: SessionRepository,
    ) {}

    /**
     * Método principal do guard: verifica se a requisição pode ser processada
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Verifica se a rota é pública (não requer autenticação)
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getClass(), context.getHandler()],
        );
        if (isPublic) {
            return true;
        }

        // Obtém o request HTTP
        const request: Request = context.switchToHttp().getRequest();
        // Extrai o token JWT do header Authorization
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token não encontrado');
        }

        // Verifica se a rota exige perfil de administrador
        const isAdm = this.reflector.getAllAndOverride<boolean>(IS_ADM_KEY, [
            context.getClass(),
            context.getHandler(),
        ]);
        if (isAdm) {
            // Busca sessão e valida se o usuário é ADM
            await this.sessionRepository
                .getSession(token)
                .then((session) => {
                    if (!session) {
                        throw new UnauthorizedException('Token inválido');
                    }
                    if (session.usuario?.cargo !== 'ADM') {
                        throw new UnauthorizedException('Acesso negado');
                    }
                })
                .catch(() => {
                    throw new UnauthorizedException('Acesso negado');
                });
        }

        // Tenta decodificar e validar o token JWT
        try {
            const payload = this.jwtService.verify<JwtPayload>(token);
            // Adiciona o userId ao request para uso posterior
            request.userId = payload.userId;
            // Se houver organização no payload, adiciona ao request
            if (payload.organizacao) {
                request.organizacaoInfo = payload.organizacao;
            }
        } catch {
            throw new UnauthorizedException('Token inválido');
        }

        return true;
    }

    /**
     * Extrai o token JWT do header Authorization do request
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        return request.headers.authorization?.split(' ')[1];
    }
}
