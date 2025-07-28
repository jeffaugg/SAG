// Importações dos módulos e tipos necessários para o interceptor de paginação
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PAGINATE_KEY } from 'src/shared/decorators/Ispaginated';
import { map } from 'rxjs/operators';


/**
 * Interface para o resultado paginado retornado pelos serviços
 */
interface PaginateResult<T> {
    items: T[];
    total: number;
}


/**
 * Interceptor responsável por formatar a resposta de endpoints paginados
 * Adiciona metadados de paginação ao resultado
 */
export class PaginateInterceptor implements NestInterceptor {
    /**
     * Injeta o Reflector para acessar metadados dos decorators
     */
    constructor(private reflector: Reflector) {}

    /**
     * Intercepta a resposta e, se a paginação estiver habilitada, formata o resultado
     */
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        // Verifica se a paginação está habilitada via decorator
        const paginateEnabled = this.reflector.getAllAndOverride<boolean>(
            PAGINATE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!paginateEnabled) {
            // Se não estiver habilitada, apenas retorna o resultado normalmente
            return next.handle();
        }

        // Se habilitada, formata o resultado com metadados de paginação
        return next.handle().pipe(
            map((result: PaginateResult<any>) => {
                const { items, total } = result;

                // Obtém os parâmetros de paginação da requisição
                const req: Request = context.switchToHttp().getRequest();
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;

                // Monta os metadados de paginação
                const meta = {
                    totalItems: total,
                    itemCount: items.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                };

                // Retorna o resultado paginado
                return { data: items, meta };
            }),
        );
    }
}
