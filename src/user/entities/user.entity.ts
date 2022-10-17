import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserConfirmationStatus } from '../enums/user-confirmation-status.enum';

@Entity('user')
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'email', type: 'varchar', length: 321 })
  email: string;

  @Field()
  @Column({ name: 'username', type: 'varchar', length: 20 })
  username: string;

  @HideField()
  @Column({ name: 'password', type: 'varchar', length: 72 })
  password: string;

  @HideField()
  @Column({
    name: 'confirmation_status',
    type: 'enum',
    enum: UserConfirmationStatus,
  })
  confirmationStatus: UserConfirmationStatus;

  @Field()
  @Column({
    name: 'available_storage_space_in_bytes',
    type: 'bigint',
  })
  availableStorageSpaceInBytes: number;
}
