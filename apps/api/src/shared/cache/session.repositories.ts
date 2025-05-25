import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Usuario } from '@prisma/client';

export interface SessionData {
  usuario: Usuario | null;
}

@Injectable()
export class SessionRepository {
  private readonly ttlSeconds: number;
  constructor(private readonly redis: RedisService) {
    this.ttlSeconds = parseInt(process.env.SESSION_TTL_SECONDS || '3600', 10);
  }

  private key(token: string) {
    return `session:${token}`;
  }

  async setUsuario(usuario: Usuario, token: string) {
    const k = this.key(token);
    await this.redis.hset(k, 'usuario', JSON.stringify(usuario));
    await this.redis.expire(k, this.ttlSeconds);
  }

  async getUsuario(token: string): Promise<Usuario | null> {
    const payload = await this.redis.hget(this.key(token), 'usuario');

    return payload ? (JSON.parse(payload) as Usuario) : null;
  }

  async getSession(token: string): Promise<SessionData | null> {
    const k = this.key(token);
    const data = await this.redis.hgetall(k);

    return {
      usuario: JSON.parse(data.usuario ?? 'null') as SessionData['usuario'],
    };
  }

  async destroy(token: string) {
    return await this.redis.del(this.key(token));
  }
}
