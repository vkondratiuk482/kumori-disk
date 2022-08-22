import { Provider } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../constants/user.constants';
import { UserRepository } from '../user.repository';

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: UserRepository,
};
