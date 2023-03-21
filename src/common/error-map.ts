import { HttpException, NotFoundException } from '@nestjs/common';
import { UserError } from 'src/user/errors/user.error';

export const ERROR_MAP: { [message: string]: HttpException } = {
  [UserError.NotFound().message]: new NotFoundException(),
};
