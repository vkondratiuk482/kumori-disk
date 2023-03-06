import { InjectEntityManager } from '@nestjs/typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager, QueryRunner } from 'typeorm';
import { AuthProviders } from '../enums/auth-providers.enum';
import { ICreateUsersAuthProviders } from '../interfaces/create-users-auth-providers.interface';
import { IUsersAuthProvidersEntity } from '../interfaces/users-auth-providers-entity.interface';
import { TypeormUsersAuthProvidersEntity } from '../entities/typeorm-users-auth-providers.entity';
import { IUsersAuthProvidersRepository } from '../interfaces/users-auth-providers-repository.interface';

export class TypeormUsersAuthProvidersRepositoryImpl
  implements IUsersAuthProvidersRepository
{
  constructor(
    private readonly als: AsyncLocalStorage<QueryRunner>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  public async findByUserIdAndProvider(
    userId: string,
    provider: AuthProviders,
  ): Promise<IUsersAuthProvidersEntity> {
    const manager = this.als.getStore()?.manager || this.manager;

    const usersAuthProviders = await manager
      .getRepository(TypeormUsersAuthProvidersEntity)
      .createQueryBuilder('uap')
      .where('user_id = :userId', { userId })
      .innerJoin('uap.provider', 'p', 'p.name = :name', { name: provider })
      .getOne();

    return usersAuthProviders;
  }

  public async create(
    data: ICreateUsersAuthProviders,
  ): Promise<IUsersAuthProvidersEntity> {
    const manager = this.als.getStore()?.manager || this.manager;

    const usersAuthProviders = manager
      .getRepository(TypeormUsersAuthProvidersEntity)
      .create(data);

    return manager.save(usersAuthProviders);
  }
}
