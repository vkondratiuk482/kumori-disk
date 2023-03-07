import { AuthProviders } from '../enums/auth-providers.enum';

export interface IAuthProviderEntity {
  readonly id: string;

  readonly name: AuthProviders;
}
