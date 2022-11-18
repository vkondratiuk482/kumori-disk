import { Provider } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../constants/user.constants';
import { TypeOrmUserRepositoryImplementation } from '../repositories/typeorm-user.repository';

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: TypeOrmUserRepositoryImplementation,
};
