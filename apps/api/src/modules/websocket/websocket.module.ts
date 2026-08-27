import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MensagensModule } from 'src/modules/mensagens/mensagens.module';
import { S3Module } from 'src/shared/upload/s3.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
    imports: [JwtModule.register({}), MensagensModule, S3Module],
    providers: [ChatGateway],
})
export class WebSocketModule {}
