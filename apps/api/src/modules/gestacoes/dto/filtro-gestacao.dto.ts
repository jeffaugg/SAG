import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';

export class GestacaoFiltroDto extends PaginacaoDto {
    @IsOptional()
    @IsString()
    @IsIn(['Pendente', 'Fechado'], {
        message: 'status deve ser Pendente ou Fechado',
    })
    status?: 'Pendente' | 'Fechado';
}
