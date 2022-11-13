import { CacheModule as NestCacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as RedisStore from 'cache-manager-redis-store';
import { CacheServiceProvider } from './providers/cache-service.provider';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        store: RedisStore,
        host: config.get<string>('REDIS_HOST'),
        port: config.get<string>('REDIS_PORT'),
        password: config.get<string>('REDIS_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [CacheServiceProvider],
  exports: [CacheServiceProvider],
})
export class CacheModule {}
