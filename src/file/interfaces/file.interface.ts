import { MimeType } from '../enums/mime-type.enum';

export interface File {
  readonly name: string;

  readonly extension: MimeType;

  readonly path: string;

  readonly buffer: Buffer;
}
