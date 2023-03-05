import { Provider } from '@nestjs/common';
import { AUTH_CONSTANTS } from '../auth.constants';
import { TypeormAuthProviderRepositoryImpl } from '../repositories/typeorm-auth-provider.repository';

export const AuthProviderRepositoryProvider: Provider = {
  useClass: TypeormAuthProviderRepositoryImpl,
  provide: AUTH_CONSTANTS.APPLICATION.PROVIDER_REPOSITORY_TOKEN,
};
