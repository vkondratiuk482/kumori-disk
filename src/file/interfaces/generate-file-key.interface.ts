import { MimeType } from '../enums/mime-type.enum';

export interface GenerateFileKey {
  readonly ownerId: string;

  readonly path: string;

  readonly name: string;
}
