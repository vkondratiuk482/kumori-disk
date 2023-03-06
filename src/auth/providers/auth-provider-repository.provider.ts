import { Provider } from '@nestjs/common';
import { AUTH_CONSTANTS } from '../auth.constants';
import { TypeormAuthProviderRepository } from '../repositories/typeorm-auth-provider.repository';

export const AuthProviderRepositoryProvider: Provider = {
  useClass: TypeormAuthProviderRepository,
  provide: AUTH_CONSTANTS.APPLICATION.PROVIDER_REPOSITORY_TOKEN,
};
