
// Importa o tipo Mensagem utilizado na resposta
import { Mensagem } from '../mensagem';


/**
 * DTO para resposta de listagem de mensagens
 */
export class GetMessagesResponse {
    /**
     * Lista de mensagens retornadas
     */
    items: Mensagem[];

    /**
     * Total de mensagens encontradas
     */
    total: number;
}
