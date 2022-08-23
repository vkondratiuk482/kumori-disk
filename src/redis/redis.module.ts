import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as RedisStore from 'cache-manager-redis-store';
import { RedisServiceProvider } from './providers/redis-service.provider';

@Module({
  imports: [
    CacheModule.registerAsync({
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
  providers: [RedisServiceProvider],
  exports: [RedisServiceProvider],
})
export class RedisModule {}
