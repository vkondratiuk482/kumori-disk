import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeormAuthProviderEntityImpl } from './typeorm-auth-provider.entity';
import { TypeOrmUserEntityImplementation } from 'src/user/entities/typeorm-user.entity';
import { UsersAuthProvidersEntity } from '../interfaces/users-auth-providers-entity.interface';

@Entity('users_auth_providers')
export class TypeormUsersAuthProvidersEntityImpl
  implements UsersAuthProvidersEntity
{
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  public userId: string;

  @Column({ name: 'provider_id', type: 'uuid' })
  public providerId: string;

  @Column({ name: 'provider_user_id', type: 'varchar', length: 321 })
  public providerUserId: string;

  @ManyToOne(
    () => TypeOrmUserEntityImplementation,
    (user) => user.usersAuthProviders,
  )
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: TypeOrmUserEntityImplementation;

  @ManyToOne(
    () => TypeormAuthProviderEntityImpl,
    (provider) => provider.usersAuthProviders,
  )
  @JoinColumn({ name: 'provider_id', referencedColumnName: 'id' })
  public provider: TypeormAuthProviderEntityImpl;
}
