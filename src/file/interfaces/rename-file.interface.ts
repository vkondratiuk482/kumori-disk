import { FileConsumer } from '../enums/file-consumer.enum';

export interface IRenameFile {
  readonly fileId: string;
  readonly ownerId: string;
  readonly ownerType: FileConsumer;
  readonly name: string;
}
