import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginacaoDto {
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit: number = 10;

    @ApiHideProperty()
    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}
