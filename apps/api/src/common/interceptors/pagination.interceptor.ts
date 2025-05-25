import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PAGINATE_KEY } from 'src/shared/decorators/Ispaginated';
import { map } from 'rxjs/operators';

interface PaginateResult<T> {
  items: T[];
  total: number;
}

export class PaginateInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const paginateEnabled = this.reflector.getAllAndOverride<boolean>(
      PAGINATE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!paginateEnabled) {
      return next.handle();
    }

    return next.handle().pipe(
      map((result: PaginateResult<any>) => {
        const { items, total } = result;

        const req: Request = context.switchToHttp().getRequest();

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const meta = {
          totalItems: total,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        };

        return { data: items, meta };
      }),
    );
  }
}
