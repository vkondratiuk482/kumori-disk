import { FileConsumer } from '../enums/file-consumer.enum';

export interface CopyFile {
  readonly fileId: string;
  readonly ownerId: string;
  readonly ownerType: FileConsumer;
  readonly copyPath: string;
}
