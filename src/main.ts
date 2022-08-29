import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import awsLambdaFastify from '@fastify/aws-lambda';
import session from '@fastify/secure-session';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import { AppModule } from './app.module';

let cachedServer: FastifyInstance;

async function bootstrap(): Promise<FastifyInstance> {
  const serverOptions: FastifyServerOptions = { logger: true };
  const instance: FastifyInstance = fastify(serverOptions);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
  );

  const config = app.get(ConfigService);

  await app.register(session, {
    key: Buffer.from(config.get<string>('SESSION_SECRET'), 'hex'),
  });

  const port = config.get<number>('APP_PORT');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  return instance;
}

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  const proxy = awsLambdaFastify(cachedServer);

  return proxy(event, context);
}
