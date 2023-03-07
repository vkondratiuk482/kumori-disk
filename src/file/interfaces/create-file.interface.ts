import { FileConsumer } from '../enums/file-consumer.enum';

export interface ICreateFile {
  readonly key: string;
  readonly sizeInBytes: number;
  readonly ownerId: string;
  readonly ownerType: FileConsumer;
}
