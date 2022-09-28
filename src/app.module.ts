import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';

import { join } from 'path';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from './mailer/mailer.module';
import { CryptographyModule } from './cryptography/cryptography.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        ttl: config.get<number>('THROTTLER_TTL'),
        limit: config.get<number>('THROTTLER_LIMIT'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        driver: MercuriusDriver,
        autoSchemaFile: join(
          process.cwd(),
          config.get<string>('GRAPHQL_SCHEMA_PATH'),
        ),
        graphiql: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MailerModule,
    RedisModule,
    FileModule,
    CryptographyModule,
  ],
})
export class AppModule {}
