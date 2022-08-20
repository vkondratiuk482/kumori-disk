import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Field()
  @Column({ name: 'email', type: 'varchar', length: 321 })
  email: string;

  @Field()
  @Column({ name: 'username', type: 'varchar', length: 20 })
  username: string;

  @HideField()
  @Column({ name: 'password', type: 'varchar', length: 72 })
  password: string;
}
