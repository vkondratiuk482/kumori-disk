import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

/**
 * The main goal is to prevent creating instance of exception
 * for each DomainError inside of HttpExceptionErrorMap
 */
export const HttpExceptions = {
  NotFound: new NotFoundException(),
  Conflict: new ConflictException(),
  Forbidden: new ForbiddenException(),
  Unauthorized: new UnauthorizedException(),
};
