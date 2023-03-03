import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypeOrmUserEntityImplementation } from './typeorm-user.entity';
import { UsersAuthProvidersEntity } from '../interfaces/users-auth-providers-entity.interface';
import { TypeormAuthProviderEntityImpl } from './typeorm-auth-provider.entity';

@Entity('users_auth_providers')
export class TypeormUsersAuthProvidersEntityImpl
  implements UsersAuthProvidersEntity
{
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  public readonly userId: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  public readonly providerId: string;

  @Column({ name: 'provider_key', type: 'string', length: 321 })
  public readonly providerKey: string;

  @ManyToOne(
    () => TypeOrmUserEntityImplementation,
    (user) => user.usersAuthProviders,
  )
  public readonly user: TypeOrmUserEntityImplementation;

  @ManyToOne(
    () => TypeormAuthProviderEntityImpl,
    (provider) => provider.usersAuthProviders,
  )
  public readonly provider: TypeormAuthProviderEntityImpl;
}
