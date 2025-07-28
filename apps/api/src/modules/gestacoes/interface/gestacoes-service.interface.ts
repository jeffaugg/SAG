
// Importa os DTOs e tipos utilizados nos métodos do serviço de gestações
import { CreateGestacaoDto } from '../dto/create-gestacao.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Gestacao } from '@prisma/client';
import { UpdateGestacaoDto } from '../dto/update-gestacao.dto';


/**
 * Interface que define o contrato do serviço de gestações
 */
export interface IGestacaoService {
  /**
   * Cria uma nova gestação
   * @param dto Dados da gestação
   */
  create(dto: CreateGestacaoDto): Promise<Gestacao>;

  /**
   * Busca uma gestação pelo ID
   * @param id ID da gestação
   */
  findOne(id: string): Promise<Gestacao>;

  /**
   * Lista as gestações de um paciente, com paginação
   * @param id ID do paciente
   * @param options Opções de paginação
   */
  findByPaciente(
    id: string,
    options: PaginacaoDto,
  ): Promise<{ items: Gestacao[]; total: number }>;

  /**
   * Atualiza uma gestação pelo ID
   * @param id ID da gestação
   * @param dto Dados para atualização
   */
  update(id: string, dto: UpdateGestacaoDto): Promise<Gestacao>;

  /**
   * Remove uma gestação pelo ID
   * @param id ID da gestação
   */
  remove(id: string): Promise<void>;

  /**
   * Lista todas as gestações, com paginação
   * @param options Opções de paginação
   */
  findAll(options: PaginacaoDto): Promise<{ items: Gestacao[]; total: number }>;
}
