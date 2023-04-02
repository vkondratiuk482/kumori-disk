import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { DomainError } from './domain-error';
import { HttpExceptionErrorMap } from './http-exception-error-map';

@Catch()
export class AllExceptionFilter
  implements GqlExceptionFilter<DomainError, GraphQLError>
{
  public catch(error: DomainError, host: ArgumentsHost): GraphQLError {
    const exception =
      HttpExceptionErrorMap.get(error.message) || new BadRequestException();

    const gqlError = new GraphQLError(error.message, {
      extensions: {
        code: exception.getStatus(),
      },
    });

    return gqlError;
  }
}
