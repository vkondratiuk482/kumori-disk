import { Provider } from '@nestjs/common';
import { AUTH_CONSTANTS } from '../auth.constants';
import { TypeormUsersAuthProvidersRepository } from '../repositories/typeorm-users-auth-providers.repository';

export const UsersAuthProvidersRepositoryProvider: Provider = {
  useClass: TypeormUsersAuthProvidersRepository,
  provide: AUTH_CONSTANTS.APPLICATION.USERS_AUTH_PROVIDERS_REPOSITORY_TOKEN,
};
