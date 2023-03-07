import { FileConsumer } from '../enums/file-consumer.enum';

export interface IFileEntity {
  readonly id: string;

  readonly key: string;

  readonly sizeInBytes: number;

  readonly ownerId: string;

  readonly ownerType: FileConsumer;
}
