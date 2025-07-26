import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from '../database/prisma.service';
@Injectable()
export class OrganizationGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const org = req.organizacaoInfo;
        if (!org) throw new UnauthorizedException();

        let ubsId: null | { id: string } = null;
        let policlinicaId: null | { id: string } = null;

        if (org.tipo === 'ubs') {
            ubsId = await this.prismaService.uBS.findUnique({
                where: { cnes: org.cnes },
                select: { id: true },
            });
        }
        if (org.tipo === 'policlinica') {
            policlinicaId = await this.prismaService.policlinica.findUnique({
                where: { cnes: org.cnes },
                select: { id: true },
            });
        }

        req.contextoAtendimento = { ubsId, policlinicaId };
        return true;
    }
}

export const currentOrganization = createParamDecorator<undefined>(
    (data, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.contextoAtendimento) {
            throw new UnauthorizedException('Usuário não autenticado');
        }

        const { ubsId, policlinicaId } = request.contextoAtendimento;

        return {
            ubsId: ubsId ? ubsId.id : null,
            policlinicaId: policlinicaId ? policlinicaId.id : null,
        };
    },
);
