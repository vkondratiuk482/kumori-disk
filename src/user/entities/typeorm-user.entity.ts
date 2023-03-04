import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../interfaces/user-entity.interface';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';
import { TypeOrmFileEntityImplementation } from 'src/file/entities/typeorm-file.entity';
import { TypeOrmPaymentPlanEntityImplementation } from 'src/payment/entities/typeorm-payment-plan.entity';
import { TypeormUsersAuthProvidersEntityImpl } from 'src/auth/entities/typeorm-users-auth-providers.entity';

@Entity('user')
export class TypeOrmUserEntityImplementation implements UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'email', type: 'varchar', length: 321 })
  public email: string;

  @Column({ name: 'username', type: 'varchar', length: 20 })
  public username: string;

  @Column({ name: 'password', type: 'varchar', length: 321 })
  public password: string;

  @Column({ name: 'github_id', type: 'int', nullable: true })
  public githubId?: number;

  @Column({
    name: 'confirmation_status',
    type: 'enum',
    enum: UserConfirmationStatuses,
  })
  public confirmationStatus: UserConfirmationStatuses;

  @Column({
    name: 'disk_space',
    type: 'bigint',
  })
  public diskSpace: number;

  @Column({ name: 'plan_id', type: 'uuid', nullable: true })
  public planId: string;

  @ManyToMany(
    () => TypeOrmFileEntityImplementation,
    (file: TypeOrmFileEntityImplementation) => file.users,
  )
  @JoinTable({ name: 'users_files' })
  public files: TypeOrmFileEntityImplementation[];

  @ManyToOne(
    () => TypeOrmPaymentPlanEntityImplementation,
    (paymentPlan: TypeOrmPaymentPlanEntityImplementation) => paymentPlan.users,
  )
  @JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
  public plan: TypeOrmPaymentPlanEntityImplementation;

  @OneToMany(
    () => TypeormUsersAuthProvidersEntityImpl,
    (usersAuthProviders) => usersAuthProviders.user,
  )
  public usersAuthProviders: TypeormUsersAuthProvidersEntityImpl;
}
