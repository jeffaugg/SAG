import { ApiProperty } from '@nestjs/swagger';
import { Cargo } from '@prisma/client';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';

export class FilterUsuariosDto extends PaginacaoDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'cargo não pode estar vazio' })
    @IsEnum(Cargo, { message: 'cargo precisa ser Enfermeiro, Medico ou ADM' })
    @ApiProperty({ example: Cargo.Enfermeiro })
    cargo?: Cargo;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(7, 7, {
        message: 'O cnes deve ter exatamente 7 caracteres.',
    })
    cnes?: string;
}
