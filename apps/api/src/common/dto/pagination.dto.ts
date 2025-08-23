// Importações de decoradores e utilitários para validação e transformação de dados
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
    page: number = 1;

    /**
     * Quantidade de itens por página (opcional, padrão 10)
     */
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit: number = 10;

    /**
     * Quantidade de itens a pular (calculado automaticamente)
     * Escondido na documentação Swagger
     */
    @ApiHideProperty()
    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}
