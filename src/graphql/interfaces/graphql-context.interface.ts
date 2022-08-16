import { FastifyRequest } from 'fastify';

export interface GraphQLContext {
  readonly req: FastifyRequest;
}
