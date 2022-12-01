import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import session from '@fastify/secure-session';

import mercuriusUpload from 'mercurius-upload';
import { UploadOptions } from 'graphql-upload';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get(ConfigService);

  await app.register(mercuriusUpload, {
    maxFiles: 10,
    maxFileSize: 10000000,
  } as UploadOptions);

  await app.register(session, {
    key: Buffer.from(config.get<string>('SESSION_SECRET'), 'hex'),
  });

  const port = config.get<number>('APP_PORT');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
