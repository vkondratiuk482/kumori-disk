import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ICacheService } from './interfaces/cache-service.interface';

@Injectable()
export class RedisCacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  public async set<T>(key: string, value: T, ttl: number): Promise<T> {
    return this.cacheManager.set<T>(key, value, { ttl });
  }

  public async delete(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }
}
