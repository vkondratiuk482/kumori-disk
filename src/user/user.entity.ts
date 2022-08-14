import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'username', type: 'varchar', length: 20 })
  username: string;

  @Column({ name: 'password', type: 'varchar', length: 36 })
  password: string;
}
