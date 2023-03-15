import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthProviders } from '../enums/auth-providers.enum';
import { IAuthProviderEntity } from '../interfaces/auth-provider-entity.interface';
import { TypeormUsersAuthProvidersEntity } from './typeorm-users-auth-providers.entity';

@Entity('auth_provider')
export class TypeormAuthProviderEntity implements IAuthProviderEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'name', type: 'varchar', length: 321 })
  public name: AuthProviders;

  @OneToMany(
    () => TypeormUsersAuthProvidersEntity,
    (usersAuthProviders) => usersAuthProviders.providerId,
  )
  public usersAuthProviders: TypeormUsersAuthProvidersEntity;
}
