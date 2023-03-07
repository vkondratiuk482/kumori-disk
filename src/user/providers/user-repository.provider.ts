import { Provider } from '@nestjs/common';
import { TypeOrmUserRepository } from '../repositories/typeorm-user.repository';
import { USER_CONSTANTS } from '../user.constants';

export const UserRepositoryProvider: Provider = {
  provide: USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
  useClass: TypeOrmUserRepository,
};
