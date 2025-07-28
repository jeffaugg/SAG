// Importações dos tipos necessários para a interface de serviço de atendimentos
import { CreateAtendimentoDto } from '../dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from '../dto/update-atendimento.dto';
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { Atendimento } from '@prisma/client';


/**
 * Interface que define o contrato do serviço de atendimentos
 */
export interface IAtendimentosService {
    /**
     * Cria um novo atendimento
     * @param dto Dados do atendimento, incluindo médico e organização
     * @param files Arquivos enviados (ex: PDFs)
     */
    create(
        dto: CreateAtendimentoDto & {
            medicoId: string;
            ubsId: string | null;
            policlinicaId: string | null;
        },
        files: Express.Multer.File[],
    ): Promise<Atendimento>;

    /**
     * Lista todos os atendimentos, com paginação
     * @param options Opções de paginação
     */
    findAll(
        options: PaginacaoDto,
    ): Promise<{ items: Atendimento[]; total: number }>;

    /**
     * Busca um atendimento pelo ID
     * @param id ID do atendimento
     */
    findById(id: string): Promise<Atendimento>;

    /**
     * Atualiza um atendimento pelo ID
     * @param id ID do atendimento
     * @param dto Dados para atualização
     */
    update(id: string, dto: UpdateAtendimentoDto): Promise<Atendimento>;

    /**
     * Remove um atendimento pelo ID
     * @param id ID do atendimento
     */
    remove(id: string): Promise<void>;
}
