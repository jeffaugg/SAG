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
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly sessionRepository: SessionRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    const isAdm = this.reflector.getAllAndOverride<boolean>(IS_ADM_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isAdm) {
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

    try {
      const payload = this.jwtService.verify<{ id: string }>(token);
      request.userId = payload.id;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
