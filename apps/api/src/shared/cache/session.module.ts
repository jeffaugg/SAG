import { Global, Module } from '@nestjs/common';
import { SessionRepository } from './session.repositories';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [SessionRepository, RedisService],
    exports: [SessionRepository],
})
export class SessionModule {}
