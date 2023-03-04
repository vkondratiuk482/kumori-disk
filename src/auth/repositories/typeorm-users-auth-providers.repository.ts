import { NotImplementedException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AuthProviders } from '../enums/auth-providers.enum';
import { UsersAuthProvidersEntity } from '../interfaces/users-auth-providers-entity.interface';
import { UsersAuthProvidersRepository } from '../interfaces/users-auth-providers-repository.interface';

export class TypeormUsersAuthProvidersRepositoryImpl
  implements UsersAuthProvidersRepository
{
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  public async findByUserIdAndProvider(
    userId: string,
    provider: AuthProviders,
  ): Promise<UsersAuthProvidersEntity> {
    throw new NotImplementedException();
  }
}
