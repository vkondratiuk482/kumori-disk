import { AuthProviders } from '../enums/auth-providers.enum';
import { CreateUsersAuthProviders } from './create-users-auth-providers.interface';
import { UsersAuthProvidersEntity } from './users-auth-providers-entity.interface';

export interface UsersAuthProvidersRepository {
  findByUserIdAndProvider(
    userId: string,
    provider: AuthProviders,
  ): Promise<UsersAuthProvidersEntity>;

  create(data: CreateUsersAuthProviders): Promise<UsersAuthProvidersEntity>;
}
