import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, QueryRunner } from 'typeorm';
import { AuthProviders } from '../enums/auth-providers.enum';
import { AsyncLocalStorage } from 'node:async_hooks';
import { TypeormAuthProviderEntity } from '../entities/typeorm-auth-provider.entity';
import { IAuthProviderEntity } from '../interfaces/auth-provider-entity.interface';
import { IAuthProviderRepository } from '../interfaces/auth-provider-repository.interface';

export class TypeormAuthProviderRepository implements IAuthProviderRepository {
  constructor(
    private readonly als: AsyncLocalStorage<QueryRunner>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  public async findByName(name: AuthProviders): Promise<IAuthProviderEntity> {
    const manager = this.als.getStore()?.manager || this.manager;

    const authProvider = await manager
      .getRepository(TypeormAuthProviderEntity)
      .createQueryBuilder('ap')
      .where('name = :name', { name })
      .getOne();

    return authProvider;
  }
}
