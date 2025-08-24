import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ForwardingPacienteDto {
    @IsString()
    @IsNotEmpty()
    @Length(7, 7)
    cnes: string;

    @IsString({ message: 'A organização deve ser UBS ou POLICLINICA' })
    organizacao: 'policlinica' | 'ubs';
}
