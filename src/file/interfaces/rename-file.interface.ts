import { FileConsumer } from '../enums/file-consumer.enum';

export interface RenameFile {
  readonly fileId: string;
  readonly ownerId: string;
  readonly ownerType: FileConsumer;
  readonly name: string;
}
