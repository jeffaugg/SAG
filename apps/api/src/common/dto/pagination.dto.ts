// src/common/dto/paginacao.dto.ts
import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginacaoDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit = 10;

  @Expose()
  @Transform(({ obj }: { obj: PaginacaoDto }) => (obj.page - 1) * obj.limit, {
    toClassOnly: true,
  })
  skip: number;
}
