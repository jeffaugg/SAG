// Importa o tipo Mensagem utilizado na resposta
import { Mensagem } from '../mensagem';

/**
 * Tipo para mensagem com informações do usuário
 */
export type MensagemComUsuario = Mensagem & {
    remetenteNome: string;
};

/**
 * DTO para resposta de listagem de mensagens
 */
export class GetMessagesResponse {
    /**
     * Lista de mensagens retornadas
     */
    items: MensagemComUsuario[];

    /**
     * Total de mensagens encontradas
     */
    total: number;
}
