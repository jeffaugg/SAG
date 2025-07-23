import { ApiHideProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
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
    @Expose()
    @Transform(
        ({ obj }: { obj: PaginacaoDto }) => {
            const page = obj.page ?? 1;
            const limit = obj.limit ?? 10;
            return (page - 1) * limit;
        },
        { toClassOnly: true },
    )
    skip!: number;
}
