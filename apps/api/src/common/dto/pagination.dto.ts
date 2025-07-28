// Importações de decoradores e utilitários para validação e transformação de dados
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';


/**
 * DTO para paginação de resultados em endpoints
 */
export class PaginacaoDto {
    /**
     * Página atual (opcional, padrão 1)
     */
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    page = 1;

    /**
     * Quantidade de itens por página (opcional, padrão 10)
     */
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit = 10;

    /**
     * Quantidade de itens a pular (calculado automaticamente)
     * Escondido na documentação Swagger
     */
    @ApiHideProperty()
    @Expose()
    @Transform(({ obj }: { obj: PaginacaoDto }) => (obj.page - 1) * obj.limit, {
        toClassOnly: true,
    })
    skip: number;
}
