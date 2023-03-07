import { Readable } from 'node:stream';

export interface IGraphQLFile {
  readonly filename: string;

  readonly mimetype: string;

  readonly encoding: string;

  readonly createReadStream: () => Readable;
}
