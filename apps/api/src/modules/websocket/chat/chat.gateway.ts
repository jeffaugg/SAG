import {
    WebSocketGateway,
    MessageBody,
    ConnectedSocket,
    SubscribeMessage,
} from '@nestjs/websockets';
import { AbstractAuthenticatedGateway } from '../abstract.auth.gateway';
import { AuthenticatedSocket } from '../interface/authenticated.socket';
import { CreateMessageDto } from 'src/modules/mensagens/dto/create-message';
import { MENSAGENS_SERVICE } from 'src/common/constants';
import { Inject, Logger } from '@nestjs/common';
import { IMensagensService } from 'src/modules/mensagens/interface/mensagens.service.interface';
import { JwtService } from '@nestjs/jwt';
import { TipoMensagem } from 'src/modules/mensagens/entidade/tipo.mensagem';
import { ConteudoDto } from 'src/modules/mensagens/dto/conteudo-dto';

@WebSocketGateway({ cors: { origin: '*' } }) //NECESSARIO ALTERAÇÃO
export class ChatGateway extends AbstractAuthenticatedGateway {
    private readonly logger = new Logger(ChatGateway.name);
    constructor(
        @Inject(MENSAGENS_SERVICE)
        private readonly mensagensService: IMensagensService,
        jwtService: JwtService,
    ) {
        super(jwtService);
    }

    @SubscribeMessage('join-gestacao')
    handleJoinGestacao(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() gestacaoId: string,
    ) {
        client.join(gestacaoId);
        this.logger.log(
            `Usuário ${client.userId} entrou na sala ${gestacaoId}`,
        );
    }

    @SubscribeMessage('send-message')
    async handleSendMessage(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() payload: { gestacaoId: string; conteudo: string },
    ) {
        const { gestacaoId, conteudo } = payload;

        const remetente = client.userId;
        const mensagem = await this.mensagensService.create(
            {
                gestacao: gestacaoId,
                tipo: TipoMensagem.TEXTO,
                conteudo: {
                    texto: conteudo,
                } as ConteudoDto,
            } as CreateMessageDto,
            remetente,
        );
        client.to(gestacaoId).emit('receive-message', mensagem);
        return { status: 'sent', mensagem };
    }
}
