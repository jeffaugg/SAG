import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const organizationInfo = createParamDecorator<undefined>(
    (data, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest();

        return request.organizacaoInfo;
    },
);
