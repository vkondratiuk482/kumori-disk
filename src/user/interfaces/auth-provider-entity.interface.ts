import { AuthProviders } from '../enums/auth-providers.enum';

export interface AuthProviderEntity {
  readonly id: string;

  readonly name: AuthProviders;
}
