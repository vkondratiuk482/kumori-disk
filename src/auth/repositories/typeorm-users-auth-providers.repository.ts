import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TypeormUsersAuthProvidersEntityImpl } from '../entities/typeorm-users-auth-providers.entity';
import { AuthProviders } from '../enums/auth-providers.enum';
import { CreateUsersAuthProviders } from '../interfaces/create-users-auth-providers.interface';
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
    const usersAuthProviders = await this.manager
      .getRepository(TypeormUsersAuthProvidersEntityImpl)
      .createQueryBuilder('uap')
      .where('user_id = :userId', { userId })
      .innerJoin('uap.provider', 'p', 'p.name = :name', { name: provider })
      .getOne();

    return usersAuthProviders;
  }

  public async create(
    data: CreateUsersAuthProviders,
  ): Promise<UsersAuthProvidersEntity> {
    const usersAuthProviders = this.manager
      .getRepository(TypeormUsersAuthProvidersEntityImpl)
      .create(data);

    return this.manager.save(usersAuthProviders);
  }
}
