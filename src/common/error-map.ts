import { HttpException, NotFoundException } from '@nestjs/common';
import { UserError } from 'src/user/errors/user.error';

export class HttpExceptionErrorMap {
  private static readonly map = new Map<string, HttpException>([
    [UserError.NotFound().message, new NotFoundException()],
  ]);

  public static get(message: string): HttpException {
    return HttpExceptionErrorMap.map.get(message);
  }
}
