import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import session from '@fastify/secure-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const config = app.get(ConfigService);

  await app.register(session, {
    key: Buffer.from(config.get<string>('SESSION_SECRET'), 'hex'),
  });

  const port = config.get<number>('PORT');

  await app.listen(port);
}
bootstrap();
