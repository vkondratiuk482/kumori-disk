import { MimeType } from '../enums/mime-type.enum';

export interface GenerateFileKey {
  readonly userId: string;

  readonly path: string;

  readonly name: string;

  readonly extension: MimeType;
}
