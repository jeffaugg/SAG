
// Importa os DTOs e tipos utilizados nos métodos do serviço de mensagens
import { PaginacaoDto } from 'src/common/dto/pagination.dto';
import { CreateMessageDto } from '../dto/create-message';
import { GetMessagesResponse } from '../dto/get-messages-reponse';
import { Mensagem } from '../mensagem';


/**
 * Interface que define o contrato do serviço de mensagens
 */
export interface IMensagensService {
    /**
     * Cria uma nova mensagem
     * @param createDto Dados da mensagem
     * @param userId ID do usuário remetente
     */
    create(createDto: CreateMessageDto, userId: string): Promise<Mensagem>;

    /**
     * Lista mensagens de uma gestação, com paginação
     * @param gestacaoId ID da gestação
     * @param options Opções de paginação
     */
    findByGestacao(
        gestacaoId: string,
        options: PaginacaoDto,
    ): Promise<GetMessagesResponse>;
}
