import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'src/shared/config/environments';

@Injectable()
export class RedisService extends Redis {
    constructor() {
        super({
            host: config.REDIS_HOST,
            password: config.REDIS_PASSWORD,
            port: 7008,
        });

        super.on('error', (error) => {
            console.log('Error redis', error);
            process.exit(1);
        });

        super.on('connect', () => {
            console.log('Redis connected');
        });
    }
}
