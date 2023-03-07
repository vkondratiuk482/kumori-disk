import { TypeOrmUserEntity } from 'src/user/entities/typeorm-user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FileConsumer } from '../enums/file-consumer.enum';
import { IFileEntity } from '../interfaces/file-entity.interface';

@Entity('file')
export class TypeOrmFileEntity implements IFileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'key', type: 'varchar', length: 320 })
  public key: string;

  @Column({ name: 'size_in_bytes', type: 'bigint' })
  public sizeInBytes: number;

  @ManyToMany(
    () => TypeOrmUserEntity,
    (user: TypeOrmUserEntity) => user.files,
  )
  public users: TypeOrmUserEntity[];

  @Column({ name: 'owner_id', type: 'uuid' })
  public ownerId: string;

  @Column({ name: 'owner_type', type: 'enum', enum: FileConsumer })
  public ownerType: FileConsumer;
}
