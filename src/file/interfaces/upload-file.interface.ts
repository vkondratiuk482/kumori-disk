import { MimeType } from '../enums/mime-type.enum';
import { FileConsumer } from '../enums/file-consumer.enum';

export interface IUploadFile {
  readonly ownerId: string;

  readonly ownerType: FileConsumer;

  readonly name: string;

  readonly extension: MimeType;

  readonly path: string;

  readonly buffer: Buffer;
}
