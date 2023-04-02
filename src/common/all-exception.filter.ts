import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { HttpExceptionErrorMap } from './error-map';
import { GraphQLError } from 'graphql';

@Catch()
export class AllExceptionFilter implements GqlExceptionFilter<Error> {
  public catch(error: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    const exception = HttpExceptionErrorMap.get(error.message);

    const gqlError = new GraphQLError(error.message, {
      extensions: {
        code: exception.getStatus(),
      },
    });

    return gqlError;
  }
}
