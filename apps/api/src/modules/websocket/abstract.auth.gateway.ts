import {
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SocketAuthPayload } from './interface/socket.auth.payload';
import { AuthenticatedSocket } from './interface/authenticated.socket';

@WebSocketGateway({ cors: { origin: '*' } })
export abstract class AbstractAuthenticatedGateway implements OnGatewayInit {
    @WebSocketServer()
    protected server: Server;

    constructor(protected readonly jwtService: JwtService) {}

    afterInit(server: Server) {
        server.use((socket: Socket, next) => {
            const { token: rawToken } = socket.handshake
                .auth as SocketAuthPayload;

            if (typeof rawToken !== 'string') {
                return next(new Error('Token ausente ou malformado'));
            }

            try {
                const token = rawToken.startsWith('Bearer ')
                    ? rawToken.slice(7)
                    : rawToken;
                const payload = this.jwtService.verify<{
                    userId: string;
                    organizacao: { tipo: string; cnes: string };
                }>(token);
                (socket as AuthenticatedSocket).userId = payload.userId;
                next();
            } catch (err) {
                return next(new Error('Token inválido: ' + err));
            }
        });
    }
}
