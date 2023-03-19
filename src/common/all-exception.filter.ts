import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ERROR_MAP } from './error-map';

@Catch()
export class AllExceptionFilter implements ExceptionFilter<Error> {
  public async catch(error: Error, host: ArgumentsHost): Promise<void> {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    const exception = ERROR_MAP[error.message];

    response.code(exception.getStatus()).send({
      message: exception.message,
      statusCode: exception.getStatus(),
    });
  }
}
