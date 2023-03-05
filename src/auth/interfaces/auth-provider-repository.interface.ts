import { AuthProviders } from '../enums/auth-providers.enum';
import { AuthProviderEntity } from './auth-provider-entity.interface';

export interface AuthProviderRepository {
  findByName(name: AuthProviders): Promise<AuthProviderEntity>;
}
