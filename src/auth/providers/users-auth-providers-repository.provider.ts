import { Provider } from '@nestjs/common';
import { AUTH_CONSTANTS } from '../auth.constants';
import { TypeormUsersAuthProvidersRepositoryImpl } from '../repositories/typeorm-users-auth-providers.repository';

export const UsersAuthProvidersRepositoryProvider: Provider = {
  useClass: TypeormUsersAuthProvidersRepositoryImpl,
  provide: AUTH_CONSTANTS.APPLICATION.USERS_AUTH_PROVIDERS_REPOSITORY_TOKEN,
};
