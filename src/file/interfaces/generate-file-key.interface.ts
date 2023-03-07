import { MimeType } from '../enums/mime-type.enum';

export interface IGenerateFileKey {
  readonly ownerId: string;

  readonly path: string;

  readonly name: string;
}
