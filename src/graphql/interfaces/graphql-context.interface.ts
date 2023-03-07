import { FastifyRequest } from 'fastify';

export interface IGraphQLContext {
  readonly req: FastifyRequest;
}
