import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { MensagensModule } from 'src/modules/mensagens/mensagens.module';

@Module({
    imports: [JwtModule.register({}), MensagensModule],
    providers: [ChatGateway],
})
export class WebSocketModule {}
