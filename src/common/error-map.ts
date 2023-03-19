import { HttpException, NotFoundException } from '@nestjs/common';
import { UserError } from 'src/user/errors/user.error';

export const ERROR_MAP = {
  [UserError.NotFound().message]: new NotFoundException(),
};
