import { FileConsumer } from '../enums/file-consumer.enum';

export interface FileEntity {
  readonly id: string;

  readonly key: string;

  readonly sizeInBytes: number;

  readonly ownerId: string;

  readonly ownerType: FileConsumer;
}
