import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { TypeOrmFileEntityImplementation } from 'src/file/entities/typeorm-file.entity';
import { TypeOrmPaymentPlanEntityImplementation } from 'src/payment/entities/typeorm-payment-plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';
import { UserEntity } from '../interfaces/user-entity.interface';

@Entity('user')
@ObjectType()
export class TypeOrmUserEntityImplementation implements UserEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field()
  @Column({ name: 'email', type: 'varchar', length: 321 })
  public email: string;

  @Field()
  @Column({ name: 'username', type: 'varchar', length: 20 })
  public username: string;

  @HideField()
  @Column({ name: 'password', type: 'varchar', length: 72 })
  public password: string;

  @HideField()
  @Column({
    name: 'confirmation_status',
    type: 'enum',
    enum: UserConfirmationStatus,
  })
  public confirmationStatus: UserConfirmationStatus;

  @Field()
  @Column({
    name: 'available_storage_space_in_bytes',
    type: 'bigint',
  })
  public availableStorageSpaceInBytes: number;

  @Column({ name: 'plan_id', type: 'uuid' })
  public planId: string;

  @ManyToMany(
    () => TypeOrmFileEntityImplementation,
    (file: TypeOrmFileEntityImplementation) => file.users,
  )
  public files: TypeOrmFileEntityImplementation[];

  @ManyToOne(
    () => TypeOrmPaymentPlanEntityImplementation,
    (paymentPlan: TypeOrmPaymentPlanEntityImplementation) => paymentPlan.users,
  )
  @JoinColumn({ name: 'plan_id', referencedColumnName: 'id' })
  plan: TypeOrmPaymentPlanEntityImplementation;
}
