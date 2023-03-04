import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthProviders } from '../enums/auth-providers.enum';
import { AuthProviderEntity } from '../interfaces/auth-provider-entity.interface';
import { TypeormUsersAuthProvidersEntityImpl } from './typeorm-users-auth-providers.entity';

@Entity('auth_provider')
export class TypeormAuthProviderEntityImpl implements AuthProviderEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'name', type: 'varchar', length: 321 })
  public name: AuthProviders;

  @OneToMany(
    () => TypeormUsersAuthProvidersEntityImpl,
    (usersAuthProviders) => usersAuthProviders.providerId,
  )
  public usersAuthProviders: TypeormUsersAuthProvidersEntityImpl;
}
