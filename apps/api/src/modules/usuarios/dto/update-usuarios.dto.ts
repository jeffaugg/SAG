import { ApiProperty } from '@nestjs/swagger';
import { Cargo } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsuariosDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'nome não pode estar vazio' })
    @ApiProperty({ example: 'Fulano' })
    nome?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: 'cargo não pode estar vazio' })
    @IsEnum(Cargo, { message: 'cargo precisa ser Enfermeiro, Medico ou ADM' })
    @ApiProperty({ example: Cargo.Enfermeiro })
    cargo?: Cargo;
}
