import { TypeOrmFileEntityImplementation } from 'src/file/entities/typeorm-file.entity';
import { TypeOrmPaymentPlanEntityImplementation } from 'src/payment/entities/typeorm-payment-plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserConfirmationStatuses } from '../enums/user-confirmation-statuses.enum';
import { UserEntity } from '../interfaces/user-entity.interface';

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

  @Column({ name: 'github_id', type: 'varchar', length: 321, nullable: true })
  public githubId?: string;

  @Column({
    name: 'confirmation_status',
    type: 'enum',
    enum: UserConfirmationStatuses,
  })
  public confirmationStatus: UserConfirmationStatuses;

  @Column({
    name: 'available_storage_space_in_bytes',
    type: 'bigint',
  })
  public availableStorageSpaceInBytes: number;

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
}
