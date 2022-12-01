import { TypeOrmUserEntityImplementation } from 'src/user/entities/typeorm-user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FileConsumer } from '../enums/file-consumer.enum';
import { FileEntity } from '../interfaces/file-entity.interface';

@Entity('file')
export class TypeOrmFileEntityImplementation implements FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'key', type: 'varchar', length: 320 })
  public key: string;

  @Column({ name: 'size_in_bytes', type: 'bigint' })
  public sizeInBytes: number;

  @ManyToMany(
    () => TypeOrmUserEntityImplementation,
    (user: TypeOrmUserEntityImplementation) => user.files,
  )
  public users: TypeOrmUserEntityImplementation[];

  @Column({ name: 'owner_id', type: 'uuid' })
  public ownerId: string;

  @Column({ name: 'owner_type', type: 'enum', enum: FileConsumer })
  public ownerType: FileConsumer;
}
