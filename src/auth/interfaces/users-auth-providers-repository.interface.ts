import { AuthProviders } from '../enums/auth-providers.enum';
import { ICreateUsersAuthProviders } from './create-users-auth-providers.interface';
import { IUsersAuthProvidersEntity } from './users-auth-providers-entity.interface';

export interface IUsersAuthProvidersRepository {
  findByUserIdAndProvider(
    userId: string,
    provider: AuthProviders,
  ): Promise<IUsersAuthProvidersEntity>;

  create(data: ICreateUsersAuthProviders): Promise<IUsersAuthProvidersEntity>;
}
