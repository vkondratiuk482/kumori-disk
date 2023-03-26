import { GqlExceptionFilter } from '@nestjs/graphql';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { ERROR_MAP } from './error-map';

@Catch()
export class AllExceptionFilter implements GqlExceptionFilter<Error> {
  public catch(error: Error, host: ArgumentsHost) {
    const exception = ERROR_MAP[error.message];

    return { message: exception.message, statusCode: exception.getStatus() };
  }
}
