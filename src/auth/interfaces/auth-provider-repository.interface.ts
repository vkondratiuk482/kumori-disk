import { AuthProviders } from '../enums/auth-providers.enum';
import { IAuthProviderEntity } from './auth-provider-entity.interface';

export interface IAuthProviderRepository {
  findByName(name: AuthProviders): Promise<IAuthProviderEntity>;
}
