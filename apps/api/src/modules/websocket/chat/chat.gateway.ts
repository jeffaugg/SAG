import {
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AbstractAuthenticatedGateway } from '../abstract.auth.gateway';
import { AuthenticatedSocket } from '../interface/authenticated.socket';

@WebSocketGateway({ cors: { origin: '*' } }) //NECESSARIO ALTERAÇÃO
export class ChatGateway extends AbstractAuthenticatedGateway {
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() content: string,
  ): string {
    const userId = (client as AuthenticatedSocket).userId;
    return `Usuário ${userId} disse: ${content}`;
  }
}
