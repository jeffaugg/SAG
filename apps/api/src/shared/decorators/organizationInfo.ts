import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const organizationInfo = createParamDecorator<undefined>(
    (data, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest();

        if (!request.organizacaoInfo) {
            throw new UnauthorizedException('Usuário não autenticado');
        }

        return request.organizacaoInfo;
    },
);
