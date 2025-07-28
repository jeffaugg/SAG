// Importa os DTOs e tipos utilizados nos métodos do serviço de gestações
import { Gestacao } from '@prisma/client';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { CreateGestacaoDto } from '../dto/create-gestacao.dto';
import { UpdateGestacaoDto } from '../dto/update-gestacao.dto';

/**
 * Interface que define o contrato do serviço de gestações
 */
export interface IGestacaoService {
    create(dto: CreateGestacaoDto): Promise<Gestacao>;
    findOne(id: string): Promise<Gestacao>;
    findByPaciente(id: string): Promise<Gestacao[]>;
    update(id: string, dto: UpdateGestacaoDto): Promise<Gestacao>;
    remove(id: string): Promise<void>;
    findAll(
        options: PaginacaoDto,
    ): Promise<{ items: Gestacao[]; total: number }>;
}
