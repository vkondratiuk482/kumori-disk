import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AuthProviders } from '../enums/auth-providers.enum';
import { AuthProviderEntity } from '../interfaces/auth-provider-entity.interface';
import { TypeormAuthProviderEntityImpl } from '../entities/typeorm-auth-provider.entity';
import { AuthProviderRepository } from '../interfaces/auth-provider-repository.interface';

export class TypeormAuthProviderRepositoryImpl
  implements AuthProviderRepository
{
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  public async findByName(name: AuthProviders): Promise<AuthProviderEntity> {
    const authProvider = await this.manager
      .getRepository(TypeormAuthProviderEntityImpl)
      .createQueryBuilder('ap')
      .where('name = :name', { name })
      .getOne();

    return authProvider;
  }
}
