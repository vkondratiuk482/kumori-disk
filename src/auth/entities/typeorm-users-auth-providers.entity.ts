import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeOrmUserEntityImplementation } from 'src/user/entities/typeorm-user.entity';
import { IUsersAuthProvidersEntity } from '../interfaces/users-auth-providers-entity.interface';
import { TypeormAuthProviderEntity } from './typeorm-auth-provider.entity';
@Entity('users_auth_providers')
export class TypeormUsersAuthProvidersEntity
  implements IUsersAuthProvidersEntity
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
    () => TypeormAuthProviderEntity,
    (provider) => provider.usersAuthProviders,
  )
  @JoinColumn({ name: 'provider_id', referencedColumnName: 'id' })
  public provider: TypeormAuthProviderEntity;
}
