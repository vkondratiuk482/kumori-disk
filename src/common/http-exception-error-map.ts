import { HttpException } from '@nestjs/common';
import { HttpExceptions } from './http-exceptions';
import { UserError } from 'src/user/errors/user.error';
import { AuthError } from 'src/auth/errors/auth.error';
import { FileError } from 'src/file/errors/file.error';

export class HttpExceptionErrorMap {
  private static readonly map = new Map<string, HttpException>([
    [UserError.NotFound().message, HttpExceptions.NotFound],
    [AuthError.MailIsInUse().message, HttpExceptions.Conflict],
    [FileError.NotAccessible().message, HttpExceptions.Forbidden],
    [UserError.ExceedsDiskSpace().message, HttpExceptions.Conflict],
    [FileError.ActionNotPerformed().message, HttpExceptions.Conflict],
    [AuthError.GithubIdNotLinked().message, HttpExceptions.Unauthorized],
    [AuthError.EmailAlreadyConfirmed().message, HttpExceptions.Conflict],
    [AuthError.GithubIdsDoNotMatch().message, HttpExceptions.Unauthorized],
    [AuthError.InvalidConfirmationHash().message, HttpExceptions.Conflict],
  ]);

  public static get(message: string): HttpException {
    return HttpExceptionErrorMap.map.get(message);
  }
}
